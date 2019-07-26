use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen(start)]
pub fn main_js() {
    console::log_1(&JsValue::from("Hello world!"));
}
