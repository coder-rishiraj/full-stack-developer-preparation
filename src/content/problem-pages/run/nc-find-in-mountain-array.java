// Run-panel harness for nc-find-in-mountain-array (see scripts/build-java-runner.mjs).
// Input: array = [1, 2, 3, 4, 5, 3, 1], target = 3. Prints the answer, then how many times
// get() was called (the judge allows 100).

interface MountainArray {
    int get(int index);

    int length();
}

class CountingMountain implements MountainArray {
    private final int[] values;
    int calls = 0;

    CountingMountain(int[] values) {
        this.values = values.clone();
    }

    @Override
    public int get(int index) {
        calls++;
        return values[index];
    }

    @Override
    public int length() {
        return values.length;
    }
}

class Harness {
    static void run(java.util.List<Object> in) {
        int[] array = runner.In.toIntArray(runner.In.arg(in, 0, "array"));
        int target = runner.In.toInt(runner.In.arg(in, 1, "target"));
        CountingMountain mountain = new CountingMountain(array);
        int answer = new Solution().findInMountainArray(target, mountain);
        System.out.println(answer);
        System.out.println("get() calls: " + mountain.calls);
    }
}
