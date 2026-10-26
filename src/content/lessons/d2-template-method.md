---
summary: Template Method puts the fixed outline of an algorithm in one base-class method and lets subclasses fill in only the steps that vary. You will learn how to write the template, the difference between abstract steps and hooks, why the template is usually final, where the pattern lives in the JDK, servlets and Spring, and when composition with Strategy is the better choice.
difficulty: intermediate
minutes: 40
objectives:
  - Explain how Template Method removes duplicated algorithm structure while keeping the step order in one place
  - Implement a template method with abstract steps, hook methods and invariant steps such as cleanup
  - Decide which parts of an algorithm belong in the base class and which in subclasses, and protect the order with final
  - Recognise template methods in AbstractList, InputStream, HttpServlet and Spring's application context
  - Compare Template Method with Strategy and avoid inheritance pitfalls such as calling overridable methods from constructors
---

## Introduction

A reporting service exports sales data in several formats. The CSV exporter writes a header line, then one line per sale, then nothing. The Markdown exporter writes a table header, one table row per sale, and a bold total at the bottom. A third exporter writes CSV but only for large sales. Written independently, each exporter repeats the same outline: start the output, loop over the sales, decide which ones to include, write each one, maybe write a footer. Only the formatting differs.

Duplicated structure is a maintenance problem. When the team decides every export should skip cancelled sales, or record how long it took, the change has to be made in every exporter, and the copies drift apart. One exporter forgets the new rule and produces a report that disagrees with the others.

The **Template Method** pattern moves the outline into a base class. One method — the **template method** — performs the steps in order, and the steps that vary are left as methods that subclasses override:

```java
public final String export(List<Sale> sales) {
    StringBuilder out = new StringBuilder();
    header(out);                                      // varies: subclass decides
    for (Sale s : sales) if (includes(s)) row(out, s); // varies
    footer(out, total(sales));                         // optional: subclass may override
    return out.toString();
}
```

The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes Template Method as defining the skeleton of an algorithm in an operation, deferring some steps to subclasses, so subclasses can redefine certain steps without changing the algorithm's structure.

It is one of the oldest and most widespread patterns in object-oriented libraries. Java's `AbstractList`, `InputStream` and `HttpServlet` are built on it, as is much of Spring's internal lifecycle. It is also the pattern most affected by the modern preference for composition over inheritance, so knowing when *not* to use it is as important as knowing how.

## Before you start

- **Inheritance and overriding** — subclasses override the varying steps. See [[c1-inheritance]] and [[c1-overload-vs-override]].
- **Abstract classes** — the base class is abstract because it is incomplete without its subclasses. See [[c1-abstract-classes]] and [[c1-abstract-vs-interface]].
- **Dynamic binding** — when the base class calls `row(...)`, Java runs the subclass's version. That runtime dispatch is the engine of the pattern. See [[c1-dynamic-binding]].
- **Composition versus inheritance** — needed for the trade-off discussion. See [[d1-composition-vs-inheritance]].
- **Strategy**, the composition-based alternative. See [[d2-strategy]].

## The intuition

Think of a standard form, such as a tax return. The form fixes the order: personal details first, then income, then deductions, then the calculation, then the signature. Every taxpayer follows the same sequence, but each fills in their own numbers. A few boxes are optional — you only complete the "foreign income" section if it applies to you. Nobody gets to reorder the sections or skip the signature.

The form is the template method. The boxes everyone must fill in are **abstract steps**. The optional sections are **hooks**. The fixed order and the mandatory signature are the **invariant parts** that the base class guarantees.

A second idea comes with the pattern, often called the **Hollywood Principle**: "don't call us, we'll call you". In ordinary code, a subclass calls methods it inherits. In a template method, the *base class* is in control and calls *down* into the subclass at the moments it chooses. The subclass never decides when its `row` method runs; it only decides what `row` does. This inversion of control is also how frameworks work in general — you write the pieces, and the framework calls them.

## The structure

```mermaid title="Template Method: the base class owns the order, subclasses supply steps"
classDiagram
  class SalesExporter {
    <<abstract>>
    +export(sales) String
    #header(out)*
    #row(out, sale)*
    #footer(out, total)
    #includes(sale) boolean
  }
  class CsvExporter {
    #header(out)
    #row(out, sale)
  }
  class MarkdownExporter {
    #header(out)
    #row(out, sale)
    #footer(out, total)
  }
  class LargeSalesCsv {
    #includes(sale) boolean
  }
  SalesExporter <|-- CsvExporter
  SalesExporter <|-- MarkdownExporter
  CsvExporter <|-- LargeSalesCsv
```

A template-method class has four kinds of method, and choosing the right kind for each step is the whole design:

- The **template method** (`export`) is public and usually `final`. It defines the order of the steps and is the method clients call.
- **Abstract steps** (`header`, `row`) are `protected abstract`. Every subclass must implement them; the algorithm cannot run without them.
- **Hooks** (`footer`, `includes`) are `protected` methods with a default implementation in the base class — often empty, or returning a sensible default. Subclasses override them only when they need to.
- **Invariant steps** are written directly in the template method or in `private` helpers (the loop, computing the total). Subclasses cannot change them at all.

Why `protected`? The steps are not meant to be called by clients — calling `row` on its own makes no sense. `protected` lets subclasses override them while keeping them out of the public interface. Why `final` on the template? Because the point of the pattern is that the order is decided once. If a subclass could override `export`, it could skip the filtering or call the steps in a different order, and the guarantee would be gone.

## A sales exporter, step by step

```java title="Exporters.java"
import java.util.List;

public class Exporters {

    record Sale(String sku, int qty, long cents) {}

    static abstract class SalesExporter {

        /** The template method: fixed order, cannot be overridden. */
        public final String export(List<Sale> sales) {
            StringBuilder out = new StringBuilder();
            header(out);
            long total = 0;
            for (Sale s : sales) {
                if (includes(s)) {
                    row(out, s);
                    total += s.cents();
                }
            }
            footer(out, total);
            return out.toString();
        }

        // Abstract steps: every exporter must supply these.
        protected abstract void header(StringBuilder out);
        protected abstract void row(StringBuilder out, Sale s);

        // Hooks: sensible defaults that subclasses may override.
        protected void footer(StringBuilder out, long totalCents) { }
        protected boolean includes(Sale s) { return true; }
    }

    static class CsvExporter extends SalesExporter {
        protected void header(StringBuilder out) { out.append("sku,qty,cents\n"); }
        protected void row(StringBuilder out, Sale s) {
            out.append(s.sku()).append(',').append(s.qty()).append(',').append(s.cents()).append('\n');
        }
    }

    static class MarkdownExporter extends SalesExporter {
        protected void header(StringBuilder out) {
            out.append("| SKU | Qty | Cents |\n|---|---|---|\n");
        }
        protected void row(StringBuilder out, Sale s) {
            out.append("| ").append(s.sku()).append(" | ").append(s.qty())
               .append(" | ").append(s.cents()).append(" |\n");
        }
        @Override protected void footer(StringBuilder out, long totalCents) {
            out.append("\n**Total:** ").append(totalCents).append(" cents\n");
        }
    }

    /** Reuses CSV formatting and overrides only the filtering hook. */
    static class LargeSalesCsv extends CsvExporter {
        @Override protected boolean includes(Sale s) { return s.cents() >= 5_000; }
    }

    public static void main(String[] args) {
        List<Sale> sales = List.of(
                new Sale("MUG", 2, 2_400),
                new Sale("DESK", 1, 18_900),
                new Sale("LAMP", 1, 5_000));

        System.out.print(new CsvExporter().export(sales));
        System.out.println("---");
        System.out.print(new MarkdownExporter().export(sales));
        System.out.println("---");
        System.out.print(new LargeSalesCsv().export(sales));
    }
}
```

```output
sku,qty,cents
MUG,2,2400
DESK,1,18900
LAMP,1,5000
---
| SKU | Qty | Cents |
|---|---|---|
| MUG | 2 | 2400 |
| DESK | 1 | 18900 |
| LAMP | 1 | 5000 |

**Total:** 26300 cents
---
sku,qty,cents
DESK,1,18900
LAMP,1,5000
```

Trace one call, `new MarkdownExporter().export(sales)`. Java runs the `export` method defined in `SalesExporter`, because `MarkdownExporter` does not (and cannot) override it. `export` calls `header(out)`; dynamic dispatch picks `MarkdownExporter.header`, which writes the table heading. For each sale, `export` calls `includes(s)` — `MarkdownExporter` does not override it, so the base class's default returns `true` — and then `MarkdownExporter.row`. Finally `export` calls `footer`, which `MarkdownExporter` overrides to print the total. The control flow lives entirely in the base class; the subclass is called three different ways without ever calling anything itself.

`CsvExporter` overrides only the two abstract steps and inherits the empty `footer`, so its output has no total. `LargeSalesCsv` goes one level further: it extends `CsvExporter` and overrides only the `includes` hook. Three lines of code produce a new exporter with different filtering and identical formatting.

Now return to the maintenance problem from the introduction. "Skip cancelled sales in every export" is now one line in `export`. "Log how long each export took" is a few lines around the loop. Neither change touches a subclass, and no subclass can forget to apply them.

```quiz
Q: Why is `export` declared `final` in `SalesExporter`?
- [ ] Because abstract classes require at least one final method
- [ ] Because final methods run faster than ordinary methods
- [x] So no subclass can change the order of the steps or skip the invariant ones, such as the filtering and the total
- [ ] So subclasses are forced to override the hooks
> The template method's job is to fix the algorithm's outline once. If a subclass could override it, it could reorder the steps or bypass the parts every exporter must perform, and the guarantee the base class offers would disappear. `final` has nothing to do with speed here, and it does not force hooks to be overridden — hooks are optional by design.
```

## Abstract steps or hooks?

The most important design decision is which steps are abstract and which are hooks.

Make a step **abstract** when there is no sensible default — when the algorithm is meaningless without it. Every exporter must produce rows, and the base class has no idea what a row looks like, so `row` is abstract. The compiler then guarantees that no concrete exporter forgets it.

Make a step a **hook** when most subclasses are happy with a default. Hooks come in three common shapes:

| Hook shape | Example | Purpose |
|---|---|---|
| Empty method | `footer(out, total) { }` | An optional extra step at a fixed point |
| Boolean query | `includes(sale)` returning `true` | Lets a subclass steer the algorithm's flow |
| Default behaviour | `separator()` returning `","` | A value most subclasses share but some change |

Two warning signs suggest the split is wrong. If almost every subclass overrides a hook, it should probably be abstract — the default is not actually the common case. If subclasses need to override many abstract steps that are each one line, the template may have been sliced too finely, and the burden of writing a subclass outweighs the benefit. Aim for a small number of meaningful steps.

Document hooks as part of the class's contract: when the base class calls each one, what state is available, and what an override may and may not do. A subclass author sees only the methods they override, not the template, so they need to know that `footer` runs after all rows and receives the total of *included* sales only.

## Guaranteeing invariant steps

Because the base class controls the flow, it can guarantee things that must happen regardless of what subclasses do. The most valuable is **cleanup**. If a template opens a resource, it should close it in a `finally` block, so an exception thrown from a subclass's step cannot leak the resource.

```java title="ImportTemplate.java"
import java.util.List;

public class ImportTemplate {

    static abstract class ImportJob {
        public final void run(List<String> lines) {
            open();
            try {
                for (String line : lines) {
                    save(parse(line));
                }
                System.out.println("  committed " + lines.size() + " rows");
            } finally {
                close();                                // runs even if a step throws
            }
        }

        private void open()  { System.out.println("  open connection"); }
        private void close() { System.out.println("  close connection"); }

        protected abstract String parse(String line);
        protected void save(String record) { System.out.println("  save " + record); }
    }

    static class UpperCaseImport extends ImportJob {
        protected String parse(String line) {
            if (line.isBlank()) throw new IllegalArgumentException("blank line");
            return line.toUpperCase();
        }
    }

    public static void main(String[] args) {
        System.out.println("good input:");
        new UpperCaseImport().run(List.of("alpha", "beta"));

        System.out.println("bad input:");
        try {
            new UpperCaseImport().run(List.of("gamma", " ", "delta"));
        } catch (IllegalArgumentException e) {
            System.out.println("  failed: " + e.getMessage());
        }
    }
}
```

```output
good input:
  open connection
  save ALPHA
  save BETA
  committed 2 rows
  close connection
bad input:
  open connection
  save GAMMA
  close connection
  failed: blank line
```

With bad input, the subclass's `parse` throws on the second line. The `finally` block in the template still closes the connection before the exception propagates to the caller. `open` and `close` are `private`, so a subclass cannot override them away or forget to call them. Timing, logging, metrics, transactions and security checks around the variable steps can be guaranteed the same way.

## How it works internally: dynamic dispatch and the constructor trap

Template Method relies on one language feature: when code in the base class calls an overridable method, Java looks at the *runtime* class of the object and runs that class's version. The `export` method is compiled once, inside `SalesExporter`, yet each call to `row` goes to whichever subclass the object really is. This is dynamic (or late) binding, and it is why a base class written years ago can call code written today.

The same mechanism creates the pattern's most famous trap. If a base-class **constructor** calls an overridable method, the subclass's override runs *before the subclass's own constructor has finished* — so its fields have not been assigned yet.

```java title="ConstructorTrap.java"
public class ConstructorTrap {

    static abstract class Widget {
        Widget() {
            System.out.println("Widget constructor calls render():");
            render();                                  // dangerous: overridable call
        }
        protected abstract void render();
    }

    static class Label extends Widget {
        private final String text;

        Label(String text) {
            super();                                   // Widget() runs first
            this.text = text;                          // assigned only after super() returns
        }

        protected void render() { System.out.println("  label text = " + text); }
    }

    public static void main(String[] args) {
        Label label = new Label("Hello");
        System.out.println("after construction:");
        label.render();
    }
}
```

```output
Widget constructor calls render():
  label text = null
after construction:
  label text = Hello
```

Java constructs an object from the top of the hierarchy down: `Label`'s constructor first calls `super()`, which runs `Widget`'s constructor completely before the line `this.text = text` executes. When `Widget()` calls `render()`, dynamic dispatch chooses `Label.render`, which reads `text` while it still holds its default value, `null`. A `final` field is observed with two different values — something the language otherwise works hard to prevent. With a `List` field, the same mistake throws `NullPointerException`.

The rule is simple: **never call overridable methods from a constructor.** Call the template method after construction, from a separate `init()` or `run()` method, or make the steps the constructor needs `private` or `final`. (Java 25 finalised *flexible constructor bodies*, previewed since Java 22, which let a subclass assign its own fields *before* calling `super(...)`. A `Label` written that way would print `Hello` both times. That helps when you control the subclass, but a base class cannot rely on every subclass doing it, so the rule still stands for base-class authors.)

```quiz
Q: In `ConstructorTrap`, why does `render()` print `null` the first time even though `text` is a `final` field assigned in the constructor?
- [ ] Because `final` fields are always `null` until the object is used
- [ ] Because `Widget` calls its own `render()`, not `Label`'s
- [x] Because `Widget`'s constructor runs before `Label`'s constructor assigns `text`, yet dynamic dispatch already calls `Label.render()`
- [ ] Because the string literal `"Hello"` is created lazily
> Construction runs from the superclass down: `super()` completes before the subclass's field assignments. Dynamic dispatch does not wait for construction to finish, so the override runs against a half-initialised object and sees the field's default value.
```

## Template Method in real systems

**`java.util.AbstractList`.** To build a read-only list, you extend `AbstractList` and implement two abstract steps: `get(int)` and `size()`. Everything else — `iterator()`, `contains`, `indexOf`, `equals`, `hashCode`, `subList`, `toString` — is a template method in the JDK written in terms of those two.

```java title="RangeList.java"
import java.util.AbstractList;
import java.util.List;

public class RangeList {

    /** The numbers start, start+step, ... — computed on demand, never stored. */
    static final class Range extends AbstractList<Integer> {
        private final int start, step, count;

        Range(int start, int step, int count) {
            this.start = start;
            this.step = step;
            this.count = count;
        }

        @Override public Integer get(int i) {
            if (i < 0 || i >= count) throw new IndexOutOfBoundsException(i);
            return start + i * step;
        }

        @Override public int size() { return count; }
    }

    public static void main(String[] args) {
        List<Integer> evens = new Range(0, 2, 6);
        System.out.println(evens);                      // toString, from AbstractCollection
        System.out.println(evens.contains(8));          // contains, via the iterator
        System.out.println(evens.indexOf(6));           // indexOf, from AbstractList
        System.out.println(evens.subList(2, 4));        // subList, from AbstractList
        System.out.println(evens.equals(List.of(0, 2, 4, 6, 8, 10)));
    }
}
```

```output
[0, 2, 4, 6, 8, 10]
true
3
[4, 6]
true
```

A dozen or so lines of code produce a fully working `List` whose elements are never stored. Calling `add` would throw `UnsupportedOperationException`, because `AbstractList.add` is a hook whose default refuses; a modifiable list overrides `set`, `add(int, E)` and `remove(int)` as well.

**`java.io.InputStream`.** The abstract step is `read()`, which returns one byte. The bulk method `read(byte[], int, int)` is implemented in the base class by calling `read()` in a loop. Concrete streams such as `FileInputStream` usually override the bulk method too, for speed — an example of a template step being optional to override for performance.

**`HttpServlet`.** The servlet container calls `service(request, response)`, which inspects the HTTP method and calls `doGet`, `doPost`, `doPut` and so on. You override only the ones your servlet supports; the defaults respond with an error saying the method is not allowed. Strictly, `service` is not `final`, so a subclass *can* override it — a reminder that real libraries do not always lock their templates. Spring's `DispatcherServlet` sits on top of this. See [[c6-servlet-foundations]].

**Spring's application context.** `AbstractApplicationContext.refresh()` is a long template method that prepares the bean factory, runs post-processors, creates beans and publishes events, calling protected hooks such as `postProcessBeanFactory` and `onRefresh` at fixed points. Spring Boot's web application contexts override `onRefresh` to start the embedded web server. See [[c5-applicationcontext]].

**Test frameworks.** JUnit 3 test classes extended `TestCase` and overrode `setUp()` and `tearDown()`, a classic template method. JUnit 5 keeps the same lifecycle — before each, test, after each — but discovers the steps through annotations such as `@BeforeEach` instead of inheritance. The order is still fixed by the framework; the Hollywood Principle survives without the subclassing. See [[c13-junit5-lifecycle]].

## Template Method versus Strategy

Both patterns handle "an algorithm with parts that vary". They differ in *how* the variation is supplied:

| | Template Method | Strategy |
|---|---|---|
| Mechanism | Inheritance: subclasses override steps | Composition: the object holds a strategy and calls it |
| Varies | Individual steps inside a fixed outline | Usually the whole algorithm, or one pluggable part |
| Chosen | At compile time, by choosing the subclass | At runtime, by passing a different strategy |
| Combining variations | Hard — one parent class only | Easy — hold several independent strategies |
| Reuse of the outline | Built in | The context class holds the outline |

The weakness of Template Method shows when variations combine. Suppose exports vary by format (CSV, Markdown) *and* by filter (all sales, large sales, this month's sales). With inheritance you need a class for each combination — `LargeSalesCsv`, `LargeSalesMarkdown`, `MonthlyCsv`... — the same explosion described in [[d1-composition-vs-inheritance]]. With composition, the exporter holds a format object and a filter, and any format can be combined with any filter:

```java title="ComposedExporter.java"
import java.util.List;
import java.util.function.Predicate;

public class ComposedExporter {

    record Sale(String sku, int qty, long cents) {}

    interface Format {
        String header();
        String row(Sale s);
    }

    /** The outline lives here; the varying parts are passed in, not inherited. */
    record Exporter(Format format, Predicate<Sale> filter) {
        String export(List<Sale> sales) {
            StringBuilder out = new StringBuilder(format.header());
            sales.stream().filter(filter).forEach(s -> out.append(format.row(s)));
            return out.toString();
        }
    }

    public static void main(String[] args) {
        Format csv = new Format() {
            public String header() { return "sku,cents\n"; }
            public String row(Sale s) { return s.sku() + "," + s.cents() + "\n"; }
        };
        Predicate<Sale> large = s -> s.cents() >= 5_000;

        List<Sale> sales = List.of(new Sale("MUG", 2, 2_400), new Sale("DESK", 1, 18_900));
        System.out.print(new Exporter(csv, large).export(sales));
    }
}
```

```output
sku,cents
DESK,18900
```

The outline is still written once, in `Exporter.export`, so the main benefit of Template Method is kept. The variation now comes from objects rather than subclasses: the format and the filter can be chosen at runtime, tested separately and combined freely. This is sometimes called a "functional template method", and it is how many modern libraries are designed. Spring's `JdbcTemplate`, despite its name, works this way: you pass a `RowMapper` callback rather than subclassing the template.

Use the inheritance form when there is one axis of variation, the steps are closely tied to the outline, and subclasses are written by the same team (or are the intended extension point of a framework). Prefer composition when variations combine, need to change at runtime, or come from code you do not control.

## Trade-offs and alternatives

Template Method removes duplicated structure, fixes the step order in one place, lets a base class guarantee invariant behaviour such as cleanup and logging, and makes adding a variant as small as overriding the steps that differ. For frameworks, it gives a clear and documented extension point.

The costs come from inheritance. Subclasses are tightly coupled to the base class: changing the template's order or a hook's meaning can break every subclass, which is the **fragile base class problem**. Java allows only one superclass, so a class cannot reuse two templates. The control flow is split between files, so understanding one subclass requires reading the base class. Deep hierarchies (a template extending a template extending a template) become hard to follow. And variation is fixed when the object is created.

Alternatives:

- **Strategy or callbacks** — the composition form shown above — when variations combine or change at runtime.
- **A pipeline of functions** when the steps themselves, not only their contents, vary — for example, a configurable list of processing stages. See [[d2-chain-of-responsibility]].
- **Default methods on an interface** can supply a template-like method without forcing a class hierarchy, though interfaces cannot hold state or make the template `final`. See [[c1-default-methods]].

## Common mistakes

> [!MISTAKE] Calling overridable methods from a constructor
> The subclass's override runs before the subclass's fields are initialised, so it sees `null` and zero values. Never call abstract steps or hooks from a constructor; invoke the template method after construction.

**Leaving the template method overridable.** Without `final`, a subclass can override the whole algorithm and silently drop invariant steps. Make the template `final` unless you have a specific reason not to.

**Making steps public.** Steps that are `public` invite clients to call them out of order. Keep them `protected` (or package-private).

**Too many tiny abstract steps.** A template with ten abstract one-line steps makes every subclass a chore and rarely reflects real variation. Merge steps until each one is a meaningful decision.

**Hooks that must be called by overrides.** Designs where a subclass's override must call `super.step()` to keep things working are fragile — someone will forget. Put the mandatory part in the template and give the subclass a separate, empty hook to extend.

**Forcing inheritance onto combinable variations.** If you find yourself writing `LargeMonthlyMarkdownExporter`, the variations should be composed, not inherited.

## Interview perspective

Interviewers ask "what is the Template Method pattern?", "Template Method versus Strategy?", and "how do you stop subclasses from changing the algorithm?". Strong answers name `final`, distinguish abstract steps from hooks, and give a real example such as `HttpServlet` or `AbstractList`. In design problems, templates appear in [[d3-logging-framework]] (a base appender that formats and then writes, with the write step varying), report generation and data import jobs.

> [!INTERVIEW] A compact answer
> "Template Method puts an algorithm's outline in a final method of an abstract base class. The steps that must vary are abstract; optional extension points are hooks with defaults. The base class calls the subclass, not the other way round, so it controls the order and can guarantee things like cleanup in a `finally`. `HttpServlet.service` dispatching to `doGet` and `doPost`, and `AbstractList` building everything on `get` and `size`, are JDK examples. Its weakness is inheritance — when variations combine or must change at runtime, I'd move the steps into strategy objects instead."

Questions to prepare:

- **Template Method versus Strategy?** Inheritance and compile-time choice of steps inside a fixed outline, versus composition and runtime choice of an algorithm or part.
- **What is a hook method?** A step with a default implementation that subclasses may override, often empty or returning a default.
- **How do you prevent subclasses from breaking the order?** Make the template method `final` and the invariant steps `private`.
- **What is the Hollywood Principle?** The framework or base class calls your code at the points it chooses; your code does not call the framework to drive the flow.
- **Why is calling an abstract method from a constructor dangerous?** The override runs before the subclass's fields are initialised.

## Practice

1. **JSON exporter.** Add a `JsonExporter` to `Exporters` that writes a JSON array. Which hooks do you need, and where does the comma between elements go — in `row`, or in a new hook?
2. **Timing.** Change `export` to print how many rows it wrote and how long it took, without touching any subclass. Explain why no subclass can bypass it.
3. **Read-write list.** Extend `Range` into a modifiable `AbstractList` subclass backed by an array that supports `set`. Which methods must you override, and which work automatically?
4. **Refactor to composition.** Rewrite `LargeSalesCsv` and `MarkdownExporter` using the `ComposedExporter` approach, and add a "this month only" filter that works with both formats.
5. **Spot the trap.** Find a class in a codebase you know whose constructor calls a non-final, non-private method. Explain what a subclass overriding it would see.

## Quick revision {#quick-revision}

- Template Method: a base-class method fixes an algorithm's outline and calls steps that subclasses supply.
- Method kinds: template (public, usually `final`), abstract steps (`protected abstract`, required), hooks (`protected` with defaults, optional), invariant steps (`private` or inline).
- Hook shapes: empty method, boolean query steering flow, overridable default value.
- Hollywood Principle: the base class calls the subclass; inversion of control.
- The base class can guarantee cleanup (`finally`), logging, timing and checks around variable steps.
- Works through dynamic dispatch; never call overridable methods from constructors — overrides see uninitialised fields.
- JDK and frameworks: `AbstractList` (`get`, `size`), `InputStream` (`read()`), `HttpServlet` (`service` → `doGet`/`doPost`), Spring `refresh()` hooks, JUnit lifecycle.
- vs Strategy: inheritance and compile-time steps vs composition and runtime algorithms; prefer composition when variations combine. `JdbcTemplate` is callback-based, not subclass-based.
- Costs: fragile base class, single inheritance, split control flow, combinatorial subclasses.

## Key takeaways {#key-takeaways}

- Template Method writes an algorithm's outline once and lets subclasses vary only the steps that genuinely differ.
- Choosing which steps are abstract, which are hooks and which are fixed is the core design work; `final` on the template protects the order.
- Because the base class is in control, it can guarantee invariant behaviour such as cleanup even when subclass code fails.
- The pattern runs on dynamic dispatch, which is also why calling overridable methods from constructors is dangerous.
- When variations combine or must change at runtime, keep the outline but supply the steps through composition, as Strategy does.
