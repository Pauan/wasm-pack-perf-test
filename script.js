const { execSync } = require("child_process");

function run(print, s) {
    execSync(s, {
        stdio: (print ? "inherit" : "ignore"),
    });
}

function time(name, f) {
    const current = process.hrtime();
    f();
    const diff = process.hrtime(current);
    // Convert to ms
    const ms = (diff[0] * 1000) + (diff[1] * 0.000001);
    console.log(name + " : " + ms + " ms");
}

function cargo(print) {
    run(print, "cargo build --release --target wasm32-unknown-unknown --lib");
}


// Clear away old files, to prevent it affecting the benchmark
run(true, "rimraf target/wasm-pack target/wasm-bindgen");

console.log("Pre-compiling project...");

// Pre-compile the project
cargo(true);

console.log("Project pre-compiled, now running benchmarks");
console.log();


time("- cargo metadata", () => {
    run(false, "cargo metadata --format-version 1 --no-deps --manifest-path ./Cargo.toml");
});

time("- rustc sysroot", () => {
    run(false, "rustc --print sysroot");
});

time("- rustc version", () => {
    run(false, "rustc --version");
});

time("- wasm-bindgen version", () => {
    run(false, "wasm-bindgen --version");
});

time("- wasm-pack version", () => {
    run(false, "wasm-pack --version");
});

console.log();


// Baseline for comparison to wasm-bindgen
time("- cargo build ", () => {
    cargo(false);
});

time("- wasm-pack   ", () => {
    run(false, "wasm-pack build --out-dir target/wasm-pack --no-typescript");
});

// It has to run both cargo and wasm-bindgen, because that's what wasm-pack does
time("- wasm-bindgen", () => {
    cargo(false);
    run(false, "wasm-bindgen --out-dir target/wasm-bindgen --no-typescript --target bundler target/wasm32-unknown-unknown/release/wasm_pack_perf_test.wasm");
});
