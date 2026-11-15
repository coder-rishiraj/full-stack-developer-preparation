// Compiles the walkthrough pages' Java programs to one JavaScript module with TeaVM.
// Do not run this directly: `npm run problems:runner` generates the program sources
// (build/programs) and then calls `gradle generateJavaScript` here.
plugins {
    java
    id("org.teavm") version "0.14.1"
}

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
            srcDir("build/programs")
        }
    }
}

teavm {
    js {
        mainClass.set("runner.Entry")
        moduleType.set(org.teavm.gradle.api.JSModuleType.ES2015)
        obfuscated.set(true)
    }
}
