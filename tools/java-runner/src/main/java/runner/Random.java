package runner;

/**
 * java.util.Random with the exact generator the Java specification defines (a 48-bit
 * linear congruential generator), so a seeded program prints the same numbers in the
 * browser as on the JVM. TeaVM's own Random does not follow the specification. The build
 * points `java.util.Random` at this class; it extends java.util.Random so it can still be
 * passed to methods such as Collections.shuffle. Method bodies follow OpenJDK 17.
 */
public class Random extends java.util.Random {
    private static final long MULTIPLIER = 0x5DEECE66DL;
    private static final long ADDEND = 0xBL;
    private static final long MASK = (1L << 48) - 1;
    private static final double DOUBLE_UNIT = 0x1.0p-53;
    private static long seedUniquifier = 8682522807148012L;

    private long seed;
    private double nextNextGaussian;
    private boolean haveNextNextGaussian;

    public Random() {
        this(nextUniquifier() ^ System.nanoTime());
    }

    public Random(long seed) {
        super(0L);
        this.seed = (seed ^ MULTIPLIER) & MASK;
    }

    private static long nextUniquifier() {
        seedUniquifier *= 1181783497276652981L;
        return seedUniquifier;
    }

    @Override
    public synchronized void setSeed(long seed) {
        this.seed = (seed ^ MULTIPLIER) & MASK;
        haveNextNextGaussian = false;
    }

    @Override
    protected int next(int bits) {
        seed = (seed * MULTIPLIER + ADDEND) & MASK;
        return (int) (seed >>> (48 - bits));
    }

    @Override
    public void nextBytes(byte[] bytes) {
        for (int i = 0, len = bytes.length; i < len; ) {
            for (int rnd = nextInt(), n = Math.min(len - i, Integer.SIZE / Byte.SIZE); n-- > 0; rnd >>= Byte.SIZE) {
                bytes[i++] = (byte) rnd;
            }
        }
    }

    @Override
    public int nextInt() {
        return next(32);
    }

    @Override
    public int nextInt(int bound) {
        if (bound <= 0) throw new IllegalArgumentException("bound must be positive");
        int r = next(31);
        int m = bound - 1;
        if ((bound & m) == 0) {
            r = (int) ((bound * (long) r) >> 31);
        } else {
            for (int u = r; u - (r = u % bound) + m < 0; u = next(31)) {
                // reject values that would make the distribution uneven
            }
        }
        return r;
    }

    @Override
    public int nextInt(int origin, int bound) {
        if (origin >= bound) throw new IllegalArgumentException("bound must be greater than origin");
        int r = nextInt();
        int n = bound - origin;
        int m = n - 1;
        if ((n & m) == 0) {
            r = (r & m) + origin;
        } else if (n > 0) {
            for (int u = r >>> 1; u + m - (r = u % n) < 0; u = nextInt() >>> 1) {
                // reject
            }
            r += origin;
        } else {
            while (r < origin || r >= bound) r = nextInt();
        }
        return r;
    }

    @Override
    public long nextLong() {
        return ((long) next(32) << 32) + next(32);
    }

    @Override
    public boolean nextBoolean() {
        return next(1) != 0;
    }

    @Override
    public float nextFloat() {
        return next(24) / ((float) (1 << 24));
    }

    @Override
    public double nextDouble() {
        return (((long) next(26) << 27) + next(27)) * DOUBLE_UNIT;
    }

    @Override
    public synchronized double nextGaussian() {
        if (haveNextNextGaussian) {
            haveNextNextGaussian = false;
            return nextNextGaussian;
        }
        double v1;
        double v2;
        double s;
        do {
            v1 = 2 * nextDouble() - 1;
            v2 = 2 * nextDouble() - 1;
            s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s == 0);
        double multiplier = StrictMath.sqrt(-2 * StrictMath.log(s) / s);
        nextNextGaussian = v2 * multiplier;
        haveNextNextGaussian = true;
        return v1 * multiplier;
    }
}
