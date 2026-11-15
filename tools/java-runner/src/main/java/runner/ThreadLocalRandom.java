package runner;

import java.util.Random;

/**
 * The subset of java.util.concurrent.ThreadLocalRandom the pages use (TeaVM's version
 * throws UnsupportedOperationException for bounded calls). Backed by java.util.Random.
 */
public final class ThreadLocalRandom {
    private static final ThreadLocalRandom INSTANCE = new ThreadLocalRandom();
    private final Random random = new Random();

    private ThreadLocalRandom() {}

    public static ThreadLocalRandom current() {
        return INSTANCE;
    }

    public int nextInt() {
        return random.nextInt();
    }

    public int nextInt(int bound) {
        if (bound <= 0) throw new IllegalArgumentException("bound must be positive");
        return random.nextInt(bound);
    }

    public int nextInt(int origin, int bound) {
        if (origin >= bound) throw new IllegalArgumentException("bound must be greater than origin");
        return origin + (int) ((bound - (long) origin) * random.nextDouble());
    }

    public long nextLong() {
        return random.nextLong();
    }

    public double nextDouble() {
        return random.nextDouble();
    }

    public boolean nextBoolean() {
        return random.nextBoolean();
    }
}
