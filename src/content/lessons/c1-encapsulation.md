---
summary: Encapsulation means an object keeps its data private and lets other code change it only through methods that enforce the rules. You will learn how to design a class so its invariants can never be broken, when getters and setters help and when they are ceremony, how mutable collections leak through getters, and how immutability, packages and modules extend the same idea.
difficulty: beginner
minutes: 50
objectives:
  - Explain what a class invariant is and how private fields plus validating constructors and methods protect it
  - Change a class's internal representation without breaking its callers
  - Detect leaked mutable state in constructors, getters and records, and fix it with defensive copies or immutable types
  - Compare an unmodifiable view with an immutable copy and choose the right one
  - Describe how packages, modules and reflection affect encapsulation at larger scales
---

## Introduction

Suppose a class has a public field `celsius`, and somewhere in a large codebase a line sets it to `-500`. Nothing stops it: the compiler is happy, the program runs, and a temperature colder than absolute zero now flows through your reports. When the bug is finally noticed, you have to search every file that can see the field to find out who wrote the bad value.

**Encapsulation** is the practice that prevents this. An encapsulated class keeps its data private and offers methods as the only way to read or change it. Those methods check the rules — a temperature cannot be below −273.15 °C, a bank balance cannot drop below its overdraft limit, a team cannot have more than its maximum members — so invalid states cannot be created from outside. If something goes wrong, the bug can only be in one class.

Encapsulation is the first of the four OOP pillars introduced in [[c1-oop]], and arguably the most practical one. It is the reason you can upgrade a library without rewriting your code, the reason frameworks such as Spring and Hibernate can be built on top of your classes, and a big part of why some objects are safe to share between threads. This lesson goes from the basic mechanics — private fields and validating methods — to the subtle failures that catch experienced developers: mutable objects leaking out through getters and constructors, records that are less sealed than they look, and reflection.

## Before you start

You need:

- **Classes and objects** — fields, methods, constructors and `new`. See [[c1-classes]] and [[c1-constructors]].
- **Access modifiers** — what `private`, package-private, `protected` and `public` allow. Taught fully in [[c1-access-modifiers]]; a short recap appears below.
- **Reference types** — that a variable holding an object holds a reference, and two references can point at the same object. See [[c1-reference-types]].
- **Lists** — `ArrayList` and `List.of`. See [[c1-arraylist]].

## The intuition

Think of a bank's cash machine. You can withdraw money, check your balance and deposit cheques, and each operation checks something first: your PIN, your balance, your daily limit. What you cannot do is open the cabinet and take out notes. The machine's state — cash in the cassettes, your account balance — is behind a steel door, and the buttons are the only way in.

The design achieves two things. It **protects rules**: no withdrawal can exceed the limit, because every withdrawal goes through the code that checks. And it **hides how things work**: the bank can replace the cassettes, the network protocol or the whole machine, and you still press the same buttons.

The analogy has a limit worth stating. A physical door stops everyone, but Java's `private` is checked by the compiler and the JVM's access rules, and code using reflection can sometimes get around it (covered near the end). Encapsulation in Java protects your design from *mistakes* by ordinary code. It is not a security boundary against hostile code running in the same JVM.

## The problem with exposed state

Here is the open version:

```java title="OpenFields.java"
class Temperature {
    public double celsius;          // anyone can write anything
}

public class OpenFields {
    public static void main(String[] args) {
        Temperature t = new Temperature();
        t.celsius = -500;           // colder than absolute zero: physically impossible
        System.out.println(t.celsius);
    }
}
```

```output
-500.0
```

There are two separate problems here. The obvious one is that an invalid value got in. The less obvious one is that the field's name, type and meaning are now **part of the class's public contract**. Every line of code that touches `t.celsius` depends on there being a `double` field called `celsius` that stores degrees Celsius. If you later want to store Kelvin internally, or add logging when the value changes, you cannot — every caller would break.

## Invariants: the rules an object guarantees

An **invariant** (more precisely a **class invariant**) is a condition that is true for every object of the class whenever outside code can observe it. "Celsius is at least −273.15" is an invariant of a temperature. "Balance equals the sum of the ledger entries" is an invariant of a wallet. "The list of dates is in increasing order" is an invariant of a schedule.

Encapsulation is how you make an invariant actually hold. The recipe has three parts:

1. **Make the fields private**, so no code outside the class can write them.
2. **Establish the invariant in every constructor.** An object that starts invalid stays invalid; reject bad input before the object exists.
3. **Preserve the invariant in every method that changes state.** Each method may assume the invariant holds when it starts, and must leave it holding when it returns, or throw without changing anything.

Here is the temperature, encapsulated:

```java title="Temperatures.java"
final class Temperature {
    private static final double ABSOLUTE_ZERO_C = -273.15;
    private double celsius;

    Temperature(double celsius) {
        setCelsius(celsius);                       // one validation path for every write
    }

    double getCelsius() { return celsius; }

    void setCelsius(double celsius) {
        if (Double.isNaN(celsius) || celsius < ABSOLUTE_ZERO_C) {
            throw new IllegalArgumentException("Invalid temperature: " + celsius);
        }
        this.celsius = celsius;
    }

    double getFahrenheit() { return celsius * 9 / 5 + 32; }   // derived, not stored
}

public class Temperatures {
    public static void main(String[] args) {
        Temperature t = new Temperature(21.5);
        System.out.println(t.getCelsius() + " C = " + t.getFahrenheit() + " F");
        try {
            t.setCelsius(-500);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        try {
            new Temperature(-300);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        System.out.println("still " + t.getCelsius());
    }
}
```

```output
21.5 C = 70.7 F
Invalid temperature: -500.0
Invalid temperature: -300.0
still 21.5
```

Walk through the decisions. The field is `private`, so `t.celsius = -500` no longer compiles anywhere outside the class. The constructor routes through the same validation as the setter, which closes a common hole: validating in the setter but letting the constructor assign directly. The check also rejects `NaN` (Not a Number), because `NaN < -273.15` is `false` and would otherwise slip through. When validation fails, the method throws *before* assigning, so the object keeps its old, valid value — the last line shows `21.5`. This is called **failing fast**: the error appears at the line that caused it, not much later when the bad value is used.

Calling an overridable method such as `setCelsius` from a constructor is safe here only because the class is `final`; in a class that can be subclassed, a subclass override would run before the subclass's own fields are initialised (see [[c1-constructors]]). And `getFahrenheit` shows a quiet benefit of hiding fields: callers cannot tell whether a value is stored or computed.

## Changing the representation without breaking callers

The second payoff of encapsulation is freedom to change how a class stores its data. Callers depend only on the methods, so the fields can be replaced.

Money is a realistic case. A first version of a `Money` class might store a `double`. Then someone notices that adding ten cents ten times does not give exactly one dollar, because `0.10` has no exact binary representation. The fix is to store a whole number of cents in a `long`. If the field were public, every caller would need rewriting. Encapsulated, only the class changes:

```java title="MoneyDemo.java"
// Version 2 of Money: the field changed from double to long cents.
// The public methods are identical to version 1, so callers did not change.
final class Money {
    private final long cents;                     // was: private final double amount;

    private Money(long cents) { this.cents = cents; }

    static Money of(String amount) {              // "12.30" -> 1230 cents
        return new Money(new java.math.BigDecimal(amount).movePointRight(2).longValueExact());
    }

    Money plus(Money other) { return new Money(Math.addExact(cents, other.cents)); }

    @Override
    public String toString() {
        return java.math.BigDecimal.valueOf(cents, 2).toPlainString();
    }
}

public class MoneyDemo {
    public static void main(String[] args) {
        Money total = Money.of("0.10");
        for (int i = 0; i < 9; i++) total = total.plus(Money.of("0.10"));
        System.out.println("Money:  " + total);

        double d = 0;
        for (int i = 0; i < 10; i++) d += 0.10;
        System.out.println("double: " + d);
    }
}
```

```output
Money:  1.00
double: 0.9999999999999999
```

The callers of `Money.of`, `plus` and `toString` never knew whether a `double` or a `long` was inside. Notice also the **private constructor**: the only way to create a `Money` is the `of` factory method, so every instance goes through the parsing and the `longValueExact` check, which throws if the amount has more than two decimal places. `Math.addExact` throws on overflow instead of silently wrapping around. Each of these is an invariant enforced at the boundary.

> [!IMPORTANT] Encapsulation is about the boundary
> The question to ask of any class is: "What can outside code do to this object, and can any of those things break its rules?" Private fields answer only part of it. Constructors, factory methods, every public method, and every object you hand out or accept are all part of the boundary.

## A short recap of access modifiers

Java controls who can see a class member with four access levels. They are taught in detail, including the subtle rules for `protected`, in [[c1-access-modifiers]].

| Modifier | Visible to |
|---|---|
| `private` | Code inside the same top-level class only |
| *(none)*, called package-private | Any class in the same package |
| `protected` | The same package, plus subclasses in other packages (with a restriction) |
| `public` | Everyone |

For encapsulation the guidance is simple: **make every field private** unless you have a specific reason not to, and give each method the narrowest level that works. `protected` fields deserve particular suspicion. They let every subclass, including ones written by other teams years later, write your state directly, so your invariants then depend on code you have never seen. Prefer private fields with `protected` methods that enforce the rules.

## Getters, setters and "tell, don't ask"

Many Java classes have a **getter** (`getName()`) and a **setter** (`setName(...)`) for every field. The naming comes from the **JavaBeans** convention: `getX()` or `isX()` for reading a property `x` (`isX` for booleans) and `setX(...)` for writing it. Frameworks such as Jackson (JSON), JPA (databases) and many template engines use reflection to find these methods by name, which is why the convention persists.

But a getter and setter pair that reads and writes a field with no checks is barely better than a public field. It keeps the option of adding validation later, which has some value, but it encapsulates nothing today. Consider an account with `getBalance()` and `setBalance(int)`. Code that wants to withdraw will read the balance, check it, subtract and call the setter — so the withdrawal rule ends up copied into every caller, exactly the problem encapsulation was meant to solve.

The better design follows a principle often called **"tell, don't ask"**: instead of asking an object for its data and making decisions outside it, tell the object what you want and let it apply its own rules. `account.withdraw(30)` instead of `account.setBalance(account.getBalance() - 30)`. Methods named after domain operations — `withdraw`, `ship`, `cancel`, `addMember` — keep the rules inside the class and make calling code read like the business process.

Some practical guidelines:

- **Not every field needs a getter.** Expose what callers genuinely need.
- **Most fields should not have setters.** If a value is fixed after creation — an ID, a creation time, an owner — make the field `final` and set it in the constructor.
- **A setter that exists should validate**, as `setCelsius` does.
- **Expose derived values** (`getFahrenheit`, `isOverdrawn`) as methods rather than storing duplicates that can drift out of sync.

> [!MISTAKE] Generating getters and setters for everything
> IDEs and tools such as Lombok can generate an accessor for every field in one click. That turns a class into a bag of public data with extra syntax. Generate only what callers need, and replace raw setters with operations that enforce rules.

## Leaky encapsulation: when references escape

Private fields hold references when their type is an object. A private field of type `List<String>` holds a reference to a list, and if your code hands that reference to someone else, they can change the list without going through any of your methods. This is called **leaking** internal state, and it is the most common way encapsulation fails in real code.

```java title="LeakyTeam.java"
import java.util.ArrayList;
import java.util.List;

class Team {
    private static final int MAX_MEMBERS = 3;
    private final List<String> members = new ArrayList<>();

    void addMember(String name) {
        if (members.size() >= MAX_MEMBERS) throw new IllegalStateException("Team is full");
        members.add(name);
    }

    List<String> getMembers() { return members; }    // hands out the real list
}

public class LeakyTeam {
    public static void main(String[] args) {
        Team team = new Team();
        team.addMember("Ana");
        team.addMember("Raj");

        List<String> view = team.getMembers();
        view.add("Mallory");
        view.add("Eve");                                 // bypasses the size check
        System.out.println(team.getMembers() + " size " + team.getMembers().size());
    }
}
```

```output
[Ana, Raj, Mallory, Eve] size 4
```

The team has four members although the limit is three. `members` is private and `final`, and it did not help: `private` stops others from reaching the *field*, and `final` stops the field from being pointed at a different list, but neither stops anyone from changing the *list object* once they hold a reference to it. The same leak happens in the other direction when a constructor stores a list the caller passed in, because the caller still holds that reference.

There are three standard fixes, and they differ in a way that matters.

### Unmodifiable views versus immutable copies

`Collections.unmodifiableList(list)` returns a **view**: a thin wrapper around your list that throws `UnsupportedOperationException` on any modifying call, but reads straight through to the original. `List.copyOf(list)` (Java 10+) returns an **immutable copy**: a new list that cannot be modified and does not change when the original does.

```java title="CopyVsView.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CopyVsView {
    public static void main(String[] args) {
        List<String> internal = new ArrayList<>(List.of("Ana", "Raj"));

        List<String> view = Collections.unmodifiableList(internal);  // read-only window
        List<String> copy = List.copyOf(internal);                   // independent snapshot

        internal.add("Lee");                     // the owner changes its own state
        System.out.println("view: " + view);
        System.out.println("copy: " + copy);

        try {
            view.add("Mallory");
        } catch (UnsupportedOperationException e) {
            System.out.println("view.add -> UnsupportedOperationException");
        }
        try {
            copy.add("Mallory");
        } catch (UnsupportedOperationException e) {
            System.out.println("copy.add -> UnsupportedOperationException");
        }
        try {
            List.copyOf(Arrays.asList("Ana", null));
        } catch (NullPointerException e) {
            System.out.println("List.copyOf rejects null elements");
        }
    }
}
```

```output
view: [Ana, Raj, Lee]
copy: [Ana, Raj]
view.add -> UnsupportedOperationException
copy.add -> UnsupportedOperationException
List.copyOf rejects null elements
```

Both refuse modification. The difference is what callers see later: the view shows `Lee`, added after it was created, while the copy does not. Choose by what callers should get:

| | `Collections.unmodifiableList(x)` | `List.copyOf(x)` |
|---|---|---|
| Can the caller modify it | No | No |
| Reflects later changes by the owner | Yes (live view) | No (snapshot) |
| Cost | O(1), no copying | O(n) copy, unless `x` is already an immutable list |
| Null elements | Allowed | Rejected with `NullPointerException` |
| Safe if another thread modifies the original | No | Yes, once created |

A view is cheap and suits a getter on an object used by one thread at a time, as long as callers understand it is live. A copy is the safe default when callers might keep the result, iterate it while the owner changes, or use it from another thread. The third fix is to avoid the problem by not returning a collection at all: offer `memberCount()`, `isMember(name)` or a `forEachMember(...)` method, which keeps the representation completely hidden.

### Defensive copies in constructors

Incoming references need the same care. If a constructor stores a list the caller passed in, the caller can change it afterwards and break whatever the constructor validated. The fix is a **defensive copy** ([[c1-defensive-copies]]): copy the input, then validate the copy.

```java title="Schedules.java"
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// Invariant: dates are in strictly increasing order.
final class Schedule {
    private final List<LocalDate> dates;

    Schedule(List<LocalDate> dates) {
        List<LocalDate> copy = List.copyOf(dates);   // copy FIRST, then validate the copy
        for (int i = 1; i < copy.size(); i++) {
            if (!copy.get(i).isAfter(copy.get(i - 1))) {
                throw new IllegalArgumentException("Dates must be increasing");
            }
        }
        this.dates = copy;
    }

    List<LocalDate> dates() { return dates; }        // already immutable: safe to share
}

// Same idea without the copy, to show the hole.
final class TrustingSchedule {
    private final List<LocalDate> dates;
    TrustingSchedule(List<LocalDate> dates) { this.dates = dates; }
    List<LocalDate> dates() { return dates; }
}

public class Schedules {
    public static void main(String[] args) {
        List<LocalDate> input = new ArrayList<>(List.of(
                LocalDate.of(2026, 3, 1), LocalDate.of(2026, 4, 1)));

        TrustingSchedule trusting = new TrustingSchedule(input);
        Schedule safe = new Schedule(input);

        input.add(LocalDate.of(2020, 1, 1));         // caller keeps using its own list
        System.out.println("trusting: " + trusting.dates());
        System.out.println("safe:     " + safe.dates());
    }
}
```

```output
trusting: [2026-03-01, 2026-04-01, 2020-01-01]
safe:     [2026-03-01, 2026-04-01]
```

The order of operations matters. If the constructor validated the caller's list and *then* copied it, another thread could change the list in the gap between the check and the copy, and the object would store data that was never validated. Copying first means you validate exactly what you store. Because the stored list came from `List.copyOf`, it is immutable, so the getter can return it directly with no further copying.

The elements matter too. `LocalDate` is immutable, so copying the list is enough. If the elements were mutable — the legacy `java.util.Date`, say — a copied list would still share the same `Date` objects, and a caller could call `setTime` on one. You would need to copy each element too (a **deep copy**), or better, use immutable element types. This is one reason modern Java code uses `java.time` types instead of `Date` and `Calendar`.

## Immutability: encapsulation by having nothing to protect

The strongest form of encapsulation is an object whose state cannot change at all after construction. An **immutable** object needs no setters, no checks on modification and no locking, because there is no modification. Validate once in the constructor and the invariant holds forever. `String`, `Integer`, `LocalDate` and `BigDecimal` are all immutable.

A class is immutable when all of these hold: every field is `private` and `final`; the class cannot be subclassed (declare it `final`, or make constructors private), so a subclass cannot add mutable state or override methods; no method changes state; and any mutable objects it holds are defensively copied in and never handed out. "Changing" an immutable object means creating a new one, as `Money.plus` does. Full details are in [[c1-immutability]].

Immutability also matters for concurrency: an immutable object that is properly constructed can be shared between threads without synchronisation, thanks to the Java Memory Model's guarantees for `final` fields ([[c3-final-field-semantics]]).

### Records are transparent, not sealed

A **record** (Java 16+) is a compact way to declare an immutable data carrier: `record Point(int x, int y) {}` generates private final fields, a constructor, accessor methods `x()` and `y()`, and `equals`, `hashCode` and `toString` ([[c1-records]]). Records are deliberately **transparent**: their state is their public API, and every component has a public accessor. Their encapsulation comes from immutability and from validation in the constructor, not from hiding.

There is a trap. A record is only shallowly immutable. Its fields are `final`, but if a component's type is mutable, the record stores and returns whatever reference it was given:

```java title="RecordLeak.java"
import java.util.ArrayList;
import java.util.List;

record LeakyRoster(String team, List<String> players) {}

record Roster(String team, List<String> players) {
    Roster {                                   // compact constructor: runs before fields are set
        if (team == null || team.isBlank()) throw new IllegalArgumentException("team required");
        players = List.copyOf(players);        // reassigns the parameter that becomes the field
    }
}

public class RecordLeak {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Ana", "Raj"));
        LeakyRoster leaky = new LeakyRoster("Blue", names);
        Roster roster = new Roster("Blue", names);

        names.add("Lee");
        System.out.println(leaky.players());
        System.out.println(roster.players());
        try {
            roster.players().add("Mallory");
        } catch (UnsupportedOperationException e) {
            System.out.println("Roster is read-only");
        }
    }
}
```

```output
[Ana, Raj, Lee]
[Ana, Raj]
Roster is read-only
```

The **compact constructor** — a constructor with no parameter list, available only in records — runs before the fields are assigned. Reassigning the parameter `players` there changes what gets stored. Copying with `List.copyOf` both detaches the record from the caller's list and makes the stored list immutable, so the generated accessor is safe to return.

## Encapsulation and threads

When several threads use the same mutable object, encapsulation is what makes thread safety achievable. If all the state is private and every access goes through the class's methods, you can make the class safe by synchronising those methods, and reason about it in one file. If state leaks out — a public field, a returned internal list — no amount of locking inside the class helps, because outside code touches the data without taking the lock.

Encapsulation also shows where the boundaries of an operation are. A wallet whose invariant is "balance equals the sum of the ledger" changes two fields together. If only the method that writes them is `synchronized` but the getter is not, a reader can see the ledger updated and the balance not yet updated, or see a stale value. Every method that reads or writes state covered by the invariant must use the same lock. The worked example below does this; concurrency rules in depth are in [[c3-thread-safety]].

## Beyond a single class: packages, modules and reflection

Encapsulation works at several scales. Within a class, `private` hides fields. Within a **package**, package-private classes and methods are visible only to code in the same package, which is how a library hides helper classes from its users ([[c1-packages]]).

Above packages sits the **Java Platform Module System** (JPMS, Java 9+). A module declares in `module-info.java` which packages it `exports`. Public classes in packages that are not exported are inaccessible to other modules, at compile time and at run time. This closes a gap that packages alone leave open: before modules, any `public` class was usable by anyone, even if it was meant to be internal. A module can also declare `opens` for packages whose private members it allows other modules to access by reflection, which frameworks such as Hibernate and Jackson need. See [[c1-modules]].

**Reflection** is the API for inspecting and using classes at run time, and `Field.setAccessible(true)` asks the JVM to suspend the access check for a private member. Whether that succeeds depends on modules:

```java title="Reflect.java"
import java.lang.reflect.Field;

class Vault {
    private int secret = 42;
}

public class Reflect {
    public static void main(String[] args) throws Exception {
        Vault v = new Vault();
        Field f = Vault.class.getDeclaredField("secret");
        f.setAccessible(true);                       // our own class on the class path
        f.setInt(v, 7);
        System.out.println("Vault.secret is now " + f.getInt(v));

        Field value = String.class.getDeclaredField("value");
        try {
            value.setAccessible(true);               // a JDK internal in java.base
        } catch (RuntimeException e) {
            System.out.println(e.getClass().getSimpleName());
        }
    }
}
```

```output
Vault.secret is now 7
InaccessibleObjectException
```

Classes on the ordinary class path all live in one "unnamed module", which is open to itself, so reflection could change `Vault.secret`. The JDK's own internals are in named modules that do not open those packages, and since Java 16 (fully enforced in Java 17, JEP 403) attempts like the second one fail with `InaccessibleObjectException`. The lesson for design: `private` protects you from mistakes and from ordinary code, and modules make that protection hold even against reflection across module boundaries.

```quiz
Q: A class stores `private final List<String> tags` and its getter returns `tags` directly. What can a caller do?
- [ ] Nothing, because the field is private
- [ ] Nothing, because the field is final
- [x] Add or remove elements, changing the object's state without its methods
- [ ] Replace the field with a different list
> private hides the field and final stops it being reassigned, but the getter hands out a reference to the list object itself. Whoever holds that reference can mutate the list. They cannot point the field at a different list, which is why the last option is wrong.

Q: You return `Collections.unmodifiableList(items)` from a getter, then the owner adds an item. What does a caller holding the earlier result see?
- [x] The new item, because it is a live view of the same list
- [ ] The old contents, because it is a copy
- [ ] An `UnsupportedOperationException` on the next read
- [ ] A `ConcurrentModificationException` on every read
> An unmodifiable view forbids changes through itself but reads through to the underlying list, so it reflects the owner's later changes. Use List.copyOf when callers need a stable snapshot. A ConcurrentModificationException can occur only if the owner modifies the list while the caller is iterating it.
```

## Worked example: a wallet with a ledger

A wallet has two pieces of state that must agree: a list of ledger entries and a running balance. Its rules are that the balance always equals the sum of the entries, that the balance never goes below the overdraft limit, and that history cannot be rewritten. It may be used from several threads.

```java title="WalletDemo.java"
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

final class Wallet {
    // Immutable value: safe to hand out, nothing to protect inside it.
    record Entry(String description, long cents) {
        Entry {
            Objects.requireNonNull(description, "description");
            if (cents == 0) throw new IllegalArgumentException("zero entry");
        }
    }

    private final String owner;
    private final long overdraftLimitCents;
    private final List<Entry> ledger = new ArrayList<>();
    private long balanceCents;               // invariant: equals the sum of ledger entries
                                             // invariant: never below -overdraftLimitCents

    Wallet(String owner, long overdraftLimitCents) {
        if (owner == null || owner.isBlank()) throw new IllegalArgumentException("owner");
        if (overdraftLimitCents < 0) throw new IllegalArgumentException("limit");
        this.owner = owner;
        this.overdraftLimitCents = overdraftLimitCents;
    }

    synchronized void deposit(String description, long cents) {
        if (cents <= 0) throw new IllegalArgumentException("deposit must be positive");
        record(new Entry(description, cents));
    }

    synchronized void pay(String description, long cents) {
        if (cents <= 0) throw new IllegalArgumentException("payment must be positive");
        if (balanceCents - cents < -overdraftLimitCents) {
            throw new IllegalStateException("would exceed overdraft limit");
        }
        record(new Entry(description, -cents));
    }

    // The only place both pieces of state change, so they cannot drift apart.
    private void record(Entry e) {
        ledger.add(e);
        balanceCents += e.cents();
    }

    synchronized long balanceCents() { return balanceCents; }

    synchronized List<Entry> history() { return List.copyOf(ledger); }

    String owner() { return owner; }
}

public class WalletDemo {
    public static void main(String[] args) {
        Wallet w = new Wallet("Asha", 5_000);
        w.deposit("salary", 200_000);
        w.pay("rent", 150_000);
        w.pay("laptop", 54_000);
        System.out.println(w.owner() + " balance: " + w.balanceCents());

        try {
            w.pay("holiday", 10_000);
        } catch (IllegalStateException e) {
            System.out.println("refused: " + e.getMessage());
        }

        List<Wallet.Entry> h = w.history();
        System.out.println(h.size() + " entries, last = " + h.get(h.size() - 1));
        try {
            h.clear();
        } catch (UnsupportedOperationException e) {
            System.out.println("history is a read-only snapshot");
        }
        System.out.println("balance unchanged: " + w.balanceCents());
    }
}
```

```output
Asha balance: -4000
refused: would exceed overdraft limit
3 entries, last = Entry[description=laptop, cents=-54000]
history is a read-only snapshot
balance unchanged: -4000
```

Follow how each rule is protected:

| Rule | How the class guarantees it |
|---|---|
| Owner is present, limit is non-negative | Checked in the constructor; fields are `final`, so they never change afterwards |
| Balance equals the sum of entries | Both change only inside the private `record` method, together |
| Balance never below the limit | `pay` checks before recording; deposits only increase the balance |
| History cannot be rewritten | `history()` returns an immutable copy; `Entry` is an immutable record |
| Consistent under multiple threads | Every method touching `ledger` or `balanceCents` is `synchronized` on the same object |

The balance went to −40.00, which is within the 50.00 overdraft, and the next payment that would have gone beyond the limit was refused without changing anything. The caller's attempt to `clear()` the history failed, and even if it had succeeded it would only have cleared a copy. `owner()` does not need synchronisation because `owner` is `final` and set in the constructor. Notice what the class does *not* have: no `setBalance`, no `getLedger` returning the real list. Leaving those out is as much a part of the design as the methods that exist.

## In real systems

- **Domain entities** in backend services encapsulate state transitions: an `Order` exposes `pay()`, `ship()` and `cancel()`, each checking the current status, rather than a `setStatus` anyone can call. This is the "rich domain model" style ([[c8-transaction-script-vs-rich-domain]]).
- **JPA entities** are a compromise. Hibernate needs a no-argument constructor and can read and write fields by reflection, so entities often look less encapsulated than plain classes, but you still keep setters off fields that should not change and validate in business methods ([[c8-entity-requirements]]).
- **API data transfer objects** (DTOs) are often records: transparent data at the edge of the system, validated on construction, converted into encapsulated domain objects inside.
- **Libraries** combine package-private helper classes, `final` public classes and JPMS exports so they can change internals between versions without breaking users. The JDK's own move to strong encapsulation in Java 16 and 17 broke tools that had reached into internals such as `sun.misc` classes and `String.value` — a visible example of why depending on another component's private details is risky.

## Trade-offs and alternatives

Encapsulation enforces invariants in one place, lets you change representation freely, gives callers a clear contract, makes validation easy to test, and is the precondition for thread safety. Its costs are mostly ceremony: accessor methods, copying, and sometimes awkwardness with frameworks that expect JavaBeans getters and setters or need reflective access.

Copying has a performance cost, O(n) per copy, which is negligible for small collections and noticeable for large ones returned in hot loops. In those cases an unmodifiable view, a query method (`contains`, `count`) or an immutable collection stored from the start (so `List.copyOf` returns it without copying) avoids the cost.

Not everything needs heavy encapsulation. A private nested helper class used only by its enclosing class, or a small package-private data holder within one package, can reasonably use plain fields: the boundary that matters is the package's or class's public API. Immutable records are often a better choice than a class with private fields and getters when the type is just data. What never pays off is exposing mutable fields in a public API.

## Common mistakes

- **Validating in the setter but not the constructor.** The constructor is a write path too. Route both through the same check, or validate in the constructor and remove the setter.
- **Returning internal mutable collections or arrays.** Return `List.copyOf`, an unmodifiable view, or a query method. For arrays, return `array.clone()` or, better, a `List`.
- **Storing caller-supplied mutable objects without copying.** The caller can change them later. Copy first, then validate the copy.
- **Assuming `final` means immutable.** A `final` field cannot be reassigned, but the object it refers to can still change.
- **Assuming records are deeply immutable.** Copy mutable components in a compact constructor.
- **`protected` fields.** Every subclass can break your invariants. Keep fields private and expose `protected` methods that check rules.
- **Synchronising writes but not reads.** A reader without the lock may see stale or half-updated state. All access to state covered by the same invariant needs the same lock.
- **Exposing mutable `Date` or `Calendar`.** Use `java.time` types, which are immutable.

## Interview perspective

Interviewers use encapsulation to check whether you design classes that protect themselves.

> [!INTERVIEW] "Isn't encapsulation just making fields private and adding getters and setters?"
> "Private fields are the mechanism, but the goal is protecting invariants and hiding representation. A getter and setter for every field with no checks protects nothing. I validate in constructors, expose domain operations like `withdraw` instead of `setBalance`, and make sure no mutable internals leak through getters or constructor arguments — `List.copyOf` in both directions."

Other questions you should be ready for:

- **Why is returning an internal list dangerous?** Callers can mutate it without validation; private and final do not prevent this. Return a copy or an unmodifiable view, and explain the difference.
- **Encapsulation versus abstraction?** Abstraction chooses what to expose; encapsulation enforces that everything else is hidden.
- **Encapsulation versus data hiding?** Data hiding (private fields) is one technique; encapsulation is the broader idea of bundling data with the operations that keep it valid.
- **Do records break encapsulation?** They are transparent by design; they encapsulate through immutability and constructor validation. Mutable components must be copied.
- **How do modules strengthen encapsulation?** Non-exported packages are inaccessible to other modules even if their classes are public, and non-opened packages resist reflective access; the JDK itself is strongly encapsulated since Java 17.
- **Why copy before validating in a constructor?** To avoid a time-of-check to time-of-use gap where another thread changes the input after validation.

## Practice

1. **Find the leaks.** Write a `Course` class with a private `List<Student>` and a private `int[] grades`. Write getters the naive way, then a `main` that breaks the class's rules through them. Fix each leak and explain your choice of copy, view or query method.
2. **Change the representation.** Implement `Temperature` storing Kelvin internally instead of Celsius, with the same public methods. Run the original `main` unchanged.
3. **Tell, don't ask.** Rewrite this caller code as a method on `Account`: `if (a.getBalance() >= amt) { a.setBalance(a.getBalance() - amt); }`. Then remove `setBalance` entirely.
4. **Immutable class.** Make `Schedule` support adding a date by returning a new `Schedule`. Check that the original is unchanged.
5. **Record with validation.** Write `record DateRange(LocalDate start, LocalDate end)` that rejects `end` before `start` and nulls. Then write `record Tags(Set<String> values)` that cannot leak.

## Quick revision {#quick-revision}

- Encapsulation = private state + methods that enforce the rules; outside code can change an object only through those methods.
- Class invariant: true whenever outside code can observe the object. Establish in every constructor, preserve in every mutator, throw before changing state on bad input.
- Hiding fields also lets you change the representation (e.g. `double` → `long` cents) without breaking callers.
- Fields private by default; `protected` fields let subclasses break invariants.
- JavaBeans: `getX` / `isX` / `setX`, used by frameworks via reflection. Not every field needs a getter; most should not have setters.
- Tell, don't ask: `withdraw(30)`, not `setBalance(getBalance() - 30)`.
- `private` and `final` do not stop mutation of a referenced object. Returning or storing a mutable reference leaks state.
- `Collections.unmodifiableList` = live read-only view (O(1)); `List.copyOf` = immutable snapshot (O(n), rejects nulls).
- Constructor defensive copy: copy first, then validate the copy. Mutable elements need deep copies; prefer immutable types such as `java.time`.
- Immutable class: private final fields, class cannot be subclassed, no mutators, mutable parts copied in and never handed out.
- Records are transparent and shallowly immutable; copy mutable components in the compact constructor.
- Thread safety needs encapsulation: all access to state under one invariant uses the same lock.
- Packages hide helpers; JPMS `exports` hides non-exported packages; `opens` allows reflection; JDK internals strongly encapsulated since Java 17.

## Key takeaways {#key-takeaways}

- Encapsulation exists so that an object's rules are enforced in one place and nothing outside can create an invalid state.
- Think in terms of the boundary: constructors, public methods, and every reference passed in or handed out.
- A private field holding a mutable object protects only the field, not the object; copy in and copy out, or use immutable types.
- Prefer domain operations to raw setters, and leave out accessors nobody needs.
- Immutability is the strongest encapsulation: validate once, share freely, no locking.
- Encapsulation scales up through packages and modules, and modules make it hold even against reflection across module boundaries.
