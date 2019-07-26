const { execSync } = require("child_process");

function run(s) {
    execSync(s, {
        stdio: "pipe",
    });
}

function time(name, f) {
    const current = process.hrtime();
    f();
    const diff = process.hrtime(current);
    const ms = (diff[0] * 1000) + (diff[1] * 0.000001);
    console.log(name + " : " + ms + " ms");
}

run("rimraf target/wasm-pack target/wasm-bindgen");
run("cargo build --release --target wasm32-unknown-unknown --lib");

time("- cargo build ", () => {
    run("cargo build --release --target wasm32-unknown-unknown --lib");
});

time("- wasm-pack   ", () => {
    run("wasm-pack build --out-dir target/wasm-pack --no-typescript");
});

time("- wasm-bindgen", () => {
    run("cargo build --release --target wasm32-unknown-unknown --lib");
    run("wasm-bindgen --out-dir target/wasm-bindgen  --no-typescript --target bundler target/wasm32-unknown-unknown/release/wasm_pack_perf_test.wasm");
});
