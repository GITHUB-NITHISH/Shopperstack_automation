"""
Generate the FULL ShoppersStack API request contract from the live Swagger 2.0 spec
(https://www.shoppersstack.com/shopping/v2/api-docs).

For every operation the document includes:
  * HTTP method + full URL
  * Authorization requirement
  * Required request headers
  * Path parameters
  * Query parameters
  * Request body schema (with types + required flags)
  * Sample request body
  * Success response(s)
  * Error responses (400 / 401 / 403 / 404 / 405 / 409 / 500) with typical bodies
  * Table of "bad-data" scenarios and the status code they produce

Output: docs/ShoppersStack_API_Request_Contract.docx
"""
from __future__ import annotations
import json
from pathlib import Path
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HERE      = Path(__file__).resolve().parent
SPEC_PATH = HERE / "swagger-shoppersstack.json"
OUT_PATH  = HERE / "ShoppersStack_API_Request_Contract.docx"
BASE_URL  = "https://www.shoppersstack.com/shopping"

PRIMARY = RGBColor(0x0B, 0x3D, 0x91)
ACCENT  = RGBColor(0x00, 0x7A, 0x33)
WARN    = RGBColor(0xB7, 0x47, 0x0E)
DANGER  = RGBColor(0xC0, 0x1E, 0x2E)
INFO    = RGBColor(0x1F, 0x6F, 0xB5)
GRAY    = RGBColor(0x33, 0x33, 0x33)

METHOD_COLOR = {"GET": ACCENT, "POST": INFO, "PUT": WARN, "PATCH": WARN, "DELETE": DANGER}
LIGHT_BG = "DCE6F5"
ALT_BG   = "F2F6FC"


# ---------------- docx helpers -----------------------------------------------
def _shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)

def _borders(cell, color="8FAADC", sz="6"):
    tcPr = cell._tc.get_or_add_tcPr()
    b = OxmlElement("w:tcBorders")
    for edge in ("top","left","bottom","right"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"),"single"); e.set(qn("w:sz"),sz); e.set(qn("w:color"),color)
        b.append(e)
    tcPr.append(b)

def _run(p, text, *, bold=False, color=None, size=None, mono=False):
    r = p.add_run(text); r.bold = bold
    if color is not None: r.font.color.rgb = color
    if size is not None: r.font.size = Pt(size)
    r.font.name = "Consolas" if mono else "Calibri"
    return r

def _bottom(p, hex_color, sz="6"):
    pPr = p._p.get_or_add_pPr()
    pbdr = OxmlElement("w:pBdr")
    b = OxmlElement("w:bottom"); b.set(qn("w:val"),"single"); b.set(qn("w:sz"),sz); b.set(qn("w:color"),hex_color)
    pbdr.append(b); pPr.append(pbdr)

def _para_shade(p, hex_color):
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"),"clear"); shd.set(qn("w:color"),"auto"); shd.set(qn("w:fill"),hex_color)
    pPr.append(shd)

def h1(doc, text):
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(18); p.paragraph_format.space_after = Pt(4)
    _run(p, text, bold=True, color=PRIMARY, size=22); _bottom(p,"0B3D91","12")

def h2(doc, text):
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(2)
    _run(p, text, bold=True, color=PRIMARY, size=15); _bottom(p,"8FAADC","6")

def h3(doc, text, color=None):
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(8); p.paragraph_format.space_after = Pt(2)
    _run(p, text, bold=True, color=color or PRIMARY, size=12)

def code(doc, text):
    p = doc.add_paragraph(); p.paragraph_format.left_indent = Cm(0.3); p.paragraph_format.space_after = Pt(4)
    _run(p, text, mono=True, size=9, color=GRAY); _para_shade(p,"F4F6FA")

def kv(doc, rows, widths=(4.2, 12.8)):
    tbl = doc.add_table(rows=len(rows), cols=2); tbl.autofit=False
    for i,(k,v) in enumerate(rows):
        c0,c1 = tbl.rows[i].cells
        c0.width = Cm(widths[0]); c1.width = Cm(widths[1])
        _shade(c0, LIGHT_BG); _shade(c1, ALT_BG if i%2 else "FFFFFF")
        _borders(c0); _borders(c1)
        p0 = c0.paragraphs[0]; p0.paragraph_format.space_after = Pt(0)
        _run(p0, k, bold=True, color=PRIMARY, size=10)
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        _run(p1, v, color=GRAY, size=10, mono=("`" in v or v.startswith("{") or v.startswith("[")))

def table(doc, headers, rows, widths=None):
    tbl = doc.add_table(rows=1+len(rows), cols=len(headers)); tbl.autofit=False
    for i,h in enumerate(headers):
        c = tbl.rows[0].cells[i]
        if widths: c.width = Cm(widths[i])
        _shade(c,"0B3D91"); _borders(c,"0B3D91")
        p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        _run(p, h, bold=True, color=RGBColor(0xFF,0xFF,0xFF), size=10)
    for r_i, row in enumerate(rows, start=1):
        for i, val in enumerate(row):
            c = tbl.rows[r_i].cells[i]
            if widths: c.width = Cm(widths[i])
            _shade(c, ALT_BG if r_i%2 else "FFFFFF"); _borders(c)
            p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
            _run(p, str(val), color=GRAY, size=9, mono=("`" in str(val)))


# ---------------- schema helpers --------------------------------------------
def resolve_ref(spec, ref):
    if not ref or not ref.startswith("#/"):
        return None
    parts = ref.lstrip("#/").split("/")
    cur = spec
    for p in parts:
        cur = cur.get(p, {})
    return cur

def flatten_schema(spec, schema, prefix="", out=None, seen=None, depth=0):
    """Flatten a swagger schema into (path, type, required, enum) rows."""
    if out is None: out = []
    if seen is None: seen = set()
    if depth > 6: return out
    if not schema: return out
    if "$ref" in schema:
        ref = schema["$ref"]
        if ref in seen: return out
        seen = seen | {ref}
        return flatten_schema(spec, resolve_ref(spec, ref), prefix, out, seen, depth+1)
    t = schema.get("type","object")
    if t == "object" or "properties" in schema:
        req = set(schema.get("required",[]))
        for name, prop in (schema.get("properties") or {}).items():
            path = f"{prefix}.{name}" if prefix else name
            if "$ref" in prop:
                if prop["$ref"] in seen:
                    out.append((path, prop["$ref"].split("/")[-1] + " (ref)", name in req, ""))
                    continue
                sub = resolve_ref(spec, prop["$ref"])
                out.append((path, sub.get("title","object"), name in req, ""))
                flatten_schema(spec, sub, path, out, seen | {prop["$ref"]}, depth+1)
            elif prop.get("type") == "array":
                items = prop.get("items", {})
                item_ty = items.get("type") or items.get("$ref","").split("/")[-1] or "any"
                out.append((path+"[]", f"array<{item_ty}>", name in req, ",".join(prop.get("enum",[])) ))
                if "$ref" in items and items["$ref"] not in seen:
                    flatten_schema(spec, resolve_ref(spec, items["$ref"]), path+"[]", out, seen | {items["$ref"]}, depth+1)
                elif items.get("type") == "object":
                    flatten_schema(spec, items, path+"[]", out, seen, depth+1)
            else:
                enum = ",".join(prop.get("enum",[])) if prop.get("enum") else ""
                fmt = prop.get("format","")
                ty = prop.get("type","any") + (f" ({fmt})" if fmt else "")
                out.append((path, ty, name in req, enum))
    return out

def sample_from_schema(spec, schema, seen=None, depth=0):
    if seen is None: seen = set()
    if depth > 6: return "…"
    if not schema: return None
    if "$ref" in schema:
        r = schema["$ref"]
        if r in seen: return {}
        return sample_from_schema(spec, resolve_ref(spec, r), seen | {r}, depth+1)
    t = schema.get("type")
    if "enum" in schema: return schema["enum"][0]
    if t == "string":
        fmt = schema.get("format","")
        if fmt == "date-time": return "2026-09-02T10:15:00Z"
        if fmt == "date": return "2001-10-04"
        return "string"
    if t == "integer": return 0
    if t == "number":  return 0.0
    if t == "boolean": return True
    if t == "array":
        return [sample_from_schema(spec, schema.get("items", {}), seen, depth+1)]
    # object
    out = {}
    for name, prop in (schema.get("properties") or {}).items():
        out[name] = sample_from_schema(spec, prop, seen, depth+1)
    return out


# ---------------- error / bad-data rules ------------------------------------
def bad_data_scenarios(op, has_body_schema, path_params, query_params, header_params):
    """Return (Scenario, Status, Response Body) rows tailored to the operation."""
    rows = []
    if has_body_schema:
        rows += [
            ("Missing required field in body",  "400 Bad Request",
             '{"timestamp":"…","status":400,"error":"Bad Request","message":"Validation failed","path":"…"}'),
            ("Wrong data type (e.g. phone as string when integer expected)", "400 Bad Request",
             '{"status":400,"error":"Bad Request","message":"JSON parse error"}'),
            ("Empty request body",              "400 Bad Request",
             '{"status":400,"error":"Bad Request","message":"Required request body is missing"}'),
            ("Invalid enum value (gender=X)",    "400 Bad Request",
             '{"status":400,"error":"Bad Request","message":"Invalid enum value"}'),
            ("Duplicate resource (email already exists)", "409 Conflict",
             '{"statusCode":409,"message":"CONFLICT","data":"Email already registered"}'),
        ]
    for p in path_params:
        rows.append((f"Non-existent {p['name']} in path", "404 Not Found",
                     '{"statusCode":404,"message":"NOT_FOUND","data":"Given ID not found"}'))
        if p.get("type") in ("integer","long"):
            rows.append((f"Non-numeric {p['name']} in path", "400 Bad Request",
                         '{"status":400,"error":"Bad Request","message":"Method argument type mismatch"}'))
    for q in query_params:
        if q.get("required"):
            rows.append((f"Missing required query param `{q['name']}`", "400 Bad Request",
                         f'{{"status":400,"error":"Bad Request","message":"Required parameter \'{q["name"]}\' is missing"}}'))
    for h in header_params:
        if h.get("required"):
            rows.append((f"Missing required header `{h['name']}`", "400 Bad Request",
                         f'{{"status":400,"error":"Bad Request","message":"Missing header \'{h["name"]}\'"}}'))
    if op.get("_secured", True):
        rows.append(("Missing / invalid JWT",    "401 Unauthorized",
                     '{"statusCode":401,"message":"UNAUTHORIZED","data":"JWT expired or invalid"}'))
        rows.append(("Role not permitted for this endpoint", "403 Forbidden",
                     '{"statusCode":403,"message":"FORBIDDEN","data":"Access denied"}'))
    rows.append(("HTTP method not supported (e.g. PATCH on POST-only)", "405 Method Not Allowed",
                 '{"status":405,"error":"Method Not Allowed"}'))
    rows.append(("Unhandled server exception",  "500 Internal Server Error",
                 '{"timestamp":"…","status":500,"error":"Internal Server Error","path":"…"}'))
    return rows

def is_secured(op_path: str) -> bool:
    """Endpoints that do NOT need JWT (public)."""
    public = ("/users/login", "/users/forgot-password", "/users/reset-password",
              "/users/verify-account", "/shoppers", "/products", "/merchants",
              "/admins", "/users/document")
    # POST /shoppers is registration → public. GETs on /products list are public.
    for p in public:
        if op_path == p or op_path.startswith(p + "/"):
            return False
    return True


# ---------------- rendering per operation -----------------------------------
def render_operation(doc, spec, path, method, op):
    method_u = method.upper()
    full_url = BASE_URL + path
    color = METHOD_COLOR.get(method_u, PRIMARY)

    # Endpoint headline
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(10)
    _run(p, f" {method_u} ", bold=True, color=RGBColor(0xFF,0xFF,0xFF), size=11)
    _run(p, "  " + path, bold=True, color=color, size=13)

    # Meta block
    consumes = ", ".join(op.get("consumes", ["application/json"]))
    produces = ", ".join(op.get("produces", ["application/json"]))
    secured  = is_secured(path)
    op["_secured"] = secured

    kv(doc, [
        ("Full URL",       full_url),
        ("Summary",        op.get("summary","—")),
        ("Description",    op.get("description","—")),
        ("Operation ID",   op.get("operationId","—")),
        ("Consumes",       consumes),
        ("Produces",       produces),
        ("Authorization",  "Bearer <jwtToken>  (required)" if secured else "Not required (public endpoint)"),
        ("Tags",           ", ".join(op.get("tags", []))),
    ])

    params = op.get("parameters", []) or []
    path_ps  = [p for p in params if p.get("in") == "path"]
    query_ps = [p for p in params if p.get("in") == "query"]
    header_ps= [p for p in params if p.get("in") == "header"]
    body_ps  = [p for p in params if p.get("in") == "body"]
    form_ps  = [p for p in params if p.get("in") == "formData"]

    # ---------- Headers ----------
    h3(doc, "Request Headers", INFO)
    header_rows = [("Accept", "application/json", "Yes")]
    if body_ps or method_u in ("POST","PUT","PATCH"):
        header_rows.append(("Content-Type", "application/json", "Yes"))
    if secured:
        header_rows.append(("Authorization", "Bearer <jwtToken>", "Yes"))
    for hp in header_ps:
        header_rows.append((hp["name"], hp.get("type","string"),
                            "Yes" if hp.get("required") else "No"))
    table(doc, ["Header","Value / Type","Required"], header_rows, widths=(5,8,3))

    # ---------- Path params ----------
    if path_ps:
        h3(doc, "Path Parameters", INFO)
        table(doc, ["Name","Type","Required","Description"],
              [(p["name"], p.get("type","string"),
                "Yes" if p.get("required") else "No",
                p.get("description","")) for p in path_ps],
              widths=(4,3,2.5,7))
    else:
        h3(doc, "Path Parameters", INFO); doc.add_paragraph("None.")

    # ---------- Query params ----------
    if query_ps:
        h3(doc, "Query Parameters", INFO)
        table(doc, ["Name","Type","Required","Description"],
              [(p["name"], p.get("type","string"),
                "Yes" if p.get("required") else "No",
                p.get("description","")) for p in query_ps],
              widths=(4,3,2.5,7))
    else:
        h3(doc, "Query Parameters", INFO); doc.add_paragraph("None.")

    # ---------- Form params ----------
    if form_ps:
        h3(doc, "Form-Data Parameters", INFO)
        table(doc, ["Name","Type","Required","Description"],
              [(p["name"], p.get("type","string"),
                "Yes" if p.get("required") else "No",
                p.get("description","")) for p in form_ps],
              widths=(4,3,2.5,7))

    # ---------- Body ----------
    has_body_schema = False
    if body_ps:
        bp = body_ps[0]
        sch = bp.get("schema", {})
        has_body_schema = True
        h3(doc, "Request Body Schema", INFO)
        # Resolve to definition for title
        def_title = ""
        if "$ref" in sch:
            def_title = sch["$ref"].split("/")[-1]
        if def_title:
            doc.add_paragraph(f"Payload type: {def_title}")
        rows = flatten_schema(spec, sch)
        if rows:
            table(doc, ["Field","Type","Required","Enum / Notes"],
                  [(r[0], r[1], "Yes" if r[2] else "No", r[3] or "") for r in rows],
                  widths=(6,4.5,2.5,4))
        h3(doc, "Sample Request Body", INFO)
        code(doc, json.dumps(sample_from_schema(spec, sch), indent=2))
    elif form_ps:
        pass  # already shown
    else:
        h3(doc, "Request Body", INFO)
        doc.add_paragraph("No body required.")

    # ---------- Responses ----------
    h3(doc, "Success Response", ACCENT)
    resps = op.get("responses", {})
    success_rows = []
    for code_str, meta in resps.items():
        if code_str.startswith("2"):
            schema_ref = ""
            if isinstance(meta, dict):
                s = meta.get("schema", {})
                schema_ref = s.get("$ref","").split("/")[-1] or s.get("type","")
            success_rows.append((code_str, meta.get("description",""), schema_ref))
    if success_rows:
        table(doc, ["Code","Description","Schema"], success_rows, widths=(2.5,9,5))
        # Sample success envelope
        code(doc,
             '{\n'
             '  "statusCode": 200,\n'
             '  "message": "Success",\n'
             '  "data": { /* payload as per schema above */ }\n'
             '}')

    # ---------- Error responses ----------
    h3(doc, "Error Responses", DANGER)
    err_rows = []
    for code_str, meta in resps.items():
        if not code_str.startswith("2"):
            err_rows.append((code_str, meta.get("description","")))
    if err_rows:
        table(doc, ["Code","Description"], err_rows, widths=(3, 13))

    # ---------- Bad-data scenarios ----------
    h3(doc, "Bad / Incorrect Data → Response Matrix", DANGER)
    rows = bad_data_scenarios(op, has_body_schema, path_ps, query_ps, header_ps)
    table(doc, ["Scenario","Status","Sample Response Body"], rows, widths=(6, 3, 8))


# ---------------- top-level build -------------------------------------------
def build():
    spec = json.loads(SPEC_PATH.read_text(encoding="utf-8"))
    doc = Document()
    doc.styles["Normal"].font.name = "Calibri"
    doc.styles["Normal"].font.size = Pt(11)
    for s in doc.sections:
        s.top_margin=Cm(1.6); s.bottom_margin=Cm(1.6); s.left_margin=Cm(1.6); s.right_margin=Cm(1.6)

    # Cover
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(80)
    _run(p, "ShoppersStack\n", bold=True, color=PRIMARY, size=36)
    _run(p, "REST API Request Contract\n", bold=True, color=PRIMARY, size=22)
    _run(p, "Generated from Live Swagger 2.0\n", bold=True, color=ACCENT, size=14)

    meta = doc.add_table(rows=6, cols=2)
    meta_data = [
        ("Spec Source",    "https://www.shoppersstack.com/shopping/v2/api-docs"),
        ("Base URL",       BASE_URL),
        ("Auth Scheme",    "Authorization: Bearer <jwtToken>  (JWT via POST /users/login)"),
        ("Content-Type",   "application/json"),
        ("Envelope",       "{ statusCode, message, data }"),
        ("Total Operations", str(sum(len([m for m in ops if m in ('get','post','put','patch','delete')]) for ops in spec['paths'].values()))),
    ]
    for i,(k,v) in enumerate(meta_data):
        c0,c1 = meta.rows[i].cells
        _shade(c0, LIGHT_BG); _shade(c1,"FFFFFF"); _borders(c0); _borders(c1)
        _run(c0.paragraphs[0], k, bold=True, color=PRIMARY, size=11)
        _run(c1.paragraphs[0], v, color=GRAY, size=11)
    doc.add_page_break()

    # Global conventions
    h1(doc, "1. Global Conventions")
    kv(doc, [
        ("Protocol", "HTTPS"),
        ("Base URL", BASE_URL),
        ("Auth", "Bearer JWT (obtained from POST /shopping/users/login)"),
        ("Content-Type", "application/json (all POST/PUT/PATCH)"),
        ("Success Envelope", '{ "statusCode": 200|201, "message": "Success|Created", "data": <payload> }'),
        ("Standard Error Envelope", '{ "statusCode": <4xx>, "message": "<CODE>", "data": "<reason>" }'),
        ("Spring Fallback Error",  '{ "timestamp": "...", "status": <code>, "error": "<Reason>", "path": "<uri>" }'),
    ])

    h2(doc, "1.1 Common HTTP Status Codes")
    table(doc, ["Code","Meaning","When"], [
        ("200","OK","Standard success"),
        ("201","Created","Resource created (register, add to cart, etc.)"),
        ("204","No Content","Successful delete"),
        ("400","Bad Request","Malformed body, missing field, wrong type, invalid enum"),
        ("401","Unauthorized","Missing / invalid / expired JWT or wrong credentials"),
        ("403","Forbidden","Authenticated but role not allowed / CORS blocked"),
        ("404","Not Found","Route or resource ID missing"),
        ("405","Method Not Allowed","Wrong HTTP verb on a route"),
        ("409","Conflict","Duplicate email / phone / resource"),
        ("500","Internal Server Error","Unhandled server exception"),
    ], widths=(2,4.5,10))

    doc.add_page_break()

    # Group operations by tag
    ops_by_tag = {}
    for path, ops in spec["paths"].items():
        for method, op in ops.items():
            if method not in ("get","post","put","patch","delete"): continue
            for tag in (op.get("tags") or ["Untagged"]):
                ops_by_tag.setdefault(tag, []).append((path, method, op))

    section_idx = 2
    for tag in sorted(ops_by_tag.keys()):
        h1(doc, f"{section_idx}. {tag}")
        section_idx += 1
        for path, method, op in sorted(ops_by_tag[tag], key=lambda x: (x[0], x[1])):
            h2(doc, f"{method.upper()} {path}")
            render_operation(doc, spec, path, method, op)
        doc.add_page_break()

    # Appendix — definitions index
    h1(doc, "Appendix A — Data Model Index")
    defs = spec.get("definitions", {})
    for name in sorted(defs.keys()):
        d = defs[name]
        h3(doc, name)
        rows = flatten_schema(spec, d)
        if rows:
            table(doc, ["Field","Type","Required","Enum / Notes"],
                  [(r[0], r[1], "Yes" if r[2] else "No", r[3] or "") for r in rows],
                  widths=(6,4.5,2.5,4))
        else:
            doc.add_paragraph("— (primitive or empty)")

    doc.save(OUT_PATH)
    print(f"Generated: {OUT_PATH}")


if __name__ == "__main__":
    build()
