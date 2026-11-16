// Compiles one bundle of walkthrough programs to a JavaScript module with TeaVM.
// Do not run this directly: `npm run problems:runner` generates each bundle's sources in
// build/chunks/<chunk> and then calls `gradle generateJavaScript -Pchunk=<chunk>` here.
plugins {
    java
    id("org.teavm") version "0.14.1"
}

val chunk = providers.gradleProperty("chunk").getOrElse("default")
layout.buildDirectory.set(file("build/out/$chunk"))

repositories {
    mavenCentral()
}

dependencies {
    implementation(teavm.libs.jsoApis)
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

sourceSets {
    main {
        java {
            srcDir("build/chunks/$chunk")
        }
    }
}

teavm {
    js {
        mainClass.set("runner.Entry")
        moduleType.set(org.teavm.gradle.api.JSModuleType.ES2015)
        obfuscated.set(true)
        // Java's runtime checks (array bounds, null, division by zero, casts), so a program
        // fails in the browser where it fails on the JVM.
        strict.set(true)
    }
}
