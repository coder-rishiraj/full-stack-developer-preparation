// Run-panel harness for nc-encode-and-decode-strings (see scripts/build-java-runner.mjs).
// Input: strs = ["hi", "", "a,b"]. Prints decode(encode(strs)), which must equal strs, then
// the encoded string itself (each approach encodes differently).

class Harness {
    static void run(java.util.List<Object> in) {
        java.util.List<String> strs = runner.In.toStrList(runner.In.arg(in, 0, "strs"));
        Solution codec = new Solution();
        String encoded = codec.encode(strs);
        java.util.List<String> decoded = codec.decode(encoded);
        System.out.println(runner.Show.of(decoded));
        System.out.println("encoded = " + runner.Show.of(encoded));
    }
}
