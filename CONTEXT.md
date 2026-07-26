# ink-mde

ink-mde is a framework-agnostic Markdown editor library with optional framework wrappers.

## Language

**Core Editor**:
The framework-agnostic editor experience exposed directly by ink-mde.
_Avoid_: core app, base app

**Framework Wrapper**:
A framework-specific component that presents the **Core Editor** through that framework's state and lifecycle model.
_Avoid_: core, integration

**File Handling**:
The editor capability that turns pasted, dropped, or selected files into Markdown through a configured handler.
_Avoid_: upload-only behavior

**Image Preview**:
The editor capability that renders Markdown image syntax as an inline visual preview.
_Avoid_: file handling, upload preview

**Toolbar**:
An optional control surface that invokes editor commands.
_Avoid_: core editor behavior

## Relationships

- The **Core Editor** is the source of shared editing behavior.
- A **Framework Wrapper** depends on the **Core Editor** and should not redefine editor behavior.
- **File Handling** belongs to the **Core Editor**, even when exposed through wrapper components.
- **Image Preview** is independent of **File Handling**; it works from Markdown syntax even when no file input path is enabled.
- The **Toolbar** can expose **Core Editor** commands, but it is not part of the core editor behavior contract.

## Example dialogue

> **Dev:** "Should we test Vue before the core behavior?"
> **Domain expert:** "No. First prove the **Core Editor** behavior. The **Framework Wrapper** tests should only cover framework state and lifecycle boundaries."
>
> **Dev:** "Is upload coverage only about the toolbar button?"
> **Domain expert:** "No. **File Handling** includes paste, drop, and selected-file flows."
>
> **Dev:** "Do we need file handling enabled to preview an image URL already in the document?"
> **Domain expert:** "No. **Image Preview** comes from Markdown image syntax, not from how that syntax got into the document."
>
> **Dev:** "Should toolbar button coverage be part of core editor behavior?"
> **Domain expert:** "No. The **Toolbar** is an optional control surface over editor commands."

## Flagged ambiguities

- "core" means the **Core Editor**, not any framework wrapper or demo app.
