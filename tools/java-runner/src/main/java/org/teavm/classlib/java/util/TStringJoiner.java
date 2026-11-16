package org.teavm.classlib.java.util;

/**
 * java.util.StringJoiner for TeaVM, whose class library lacks it (String.join and
 * Collectors.joining need it). TeaVM maps java.util.StringJoiner to this class by name.
 */
public final class TStringJoiner {
    private final String prefix;
    private final String delimiter;
    private final String suffix;
    private StringBuilder value;
    private String emptyValue;

    public TStringJoiner(CharSequence delimiter) {
        this(delimiter, "", "");
    }

    public TStringJoiner(CharSequence delimiter, CharSequence prefix, CharSequence suffix) {
        if (delimiter == null || prefix == null || suffix == null) throw new NullPointerException();
        this.prefix = prefix.toString();
        this.delimiter = delimiter.toString();
        this.suffix = suffix.toString();
        this.emptyValue = this.prefix + this.suffix;
    }

    public TStringJoiner setEmptyValue(CharSequence emptyValue) {
        if (emptyValue == null) throw new NullPointerException();
        this.emptyValue = emptyValue.toString();
        return this;
    }

    public TStringJoiner add(CharSequence newElement) {
        if (value == null) value = new StringBuilder().append(prefix);
        else value.append(delimiter);
        value.append(newElement == null ? "null" : newElement.toString());
        return this;
    }

    public TStringJoiner merge(TStringJoiner other) {
        if (other.value != null) {
            String content = other.value.substring(other.prefix.length());
            if (value == null) value = new StringBuilder().append(prefix);
            else value.append(delimiter);
            value.append(content);
        }
        return this;
    }

    public int length() {
        return value == null ? emptyValue.length() : value.length() + suffix.length();
    }

    @Override
    public String toString() {
        return value == null ? emptyValue : value.toString() + suffix;
    }
}
