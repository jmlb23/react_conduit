export type Errors =
  { message: "error", code: 400 }
  | { message: "error", code: 401 }
  | { message: "error", code: 403 }
  | { message: "error", code: 404 }
  | { message: "error", code: number };

export function isErrors<T>(t: T | Errors): t is Errors {
  return typeof t === "object" && t !== null && "message" in t
}

export function isOther<T>(t: T | Errors): t is T {
  return !isErrors(t)
}

export function construct(code: number): Errors {
  switch (code) {
    case 400: return { message: "error", code: 400 }
    case 401: return { message: "error", code: 401 }
    case 403: return { message: "error", code: 403 }
    case 404: return { message: "error", code: 404 }
    default: return { message: "error", code: code }
  }
}
