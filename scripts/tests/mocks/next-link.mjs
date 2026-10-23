import {createElement} from "react";
export default function Link({href, children, scroll: _s, prefetch: _p, ...rest}) {
  return createElement("a", {href, ...rest}, children);
}
