import { useState, useCallback } from "react"
import type { DesignFlowTheme } from "../types"
import { generateThemeCSS } from "../runtime/theme-loader"

interface ThemePanelProps {
  theme: DesignFlowTheme
  onClose: () => void
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function injectThemeCSS(theme: DesignFlowTheme) {
  const styleEl = document.querySelector("[data-designflow-theme]")
  if (styleEl) {
    styleEl.textContent = generateThemeCSS(theme)
  }
}

const colorLabels: Record<string, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  surface: "Surface",
  surfaceAlt: "Surface Alt",
  border: "Border",
  text: "Text",
  textMuted: "Text Muted",
  textInvert: "Text Invert",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
}

export function ThemePanel({ theme, onClose }: ThemePanelProps) {
  const [localTheme, setLocalTheme] = useState<DesignFlowTheme>(() => deepClone(theme))

  const updateAndInject = useCallback((updater: (prev: DesignFlowTheme) => DesignFlowTheme) => {
    setLocalTheme((prev) => {
      const next = updater(prev)
      injectThemeCSS(next)
      return next
    })
  }, [])

  const handleColorChange = useCallback((key: string, value: string) => {
    updateAndInject((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }))
  }, [updateAndInject])

  const handleRadiusChange = useCallback((key: string, value: string) => {
    updateAndInject((prev) => ({
      ...prev,
      radius: { ...prev.radius, [key]: value },
    }))
  }, [updateAndInject])

  const handleSpacingChange = useCallback((key: string, value: string) => {
    updateAndInject((prev) => ({
      ...prev,
      spacing: { ...prev.spacing, [key]: value },
    }))
  }, [updateAndInject])

  const handleTypographyFontFamilyChange = useCallback((value: string) => {
    updateAndInject((prev) => ({
      ...prev,
      typography: { ...prev.typography, fontFamily: value },
    }))
  }, [updateAndInject])

  const handleTypographyHeadingWeightChange = useCallback((value: number) => {
    updateAndInject((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        heading: { ...prev.typography.heading, weight: value },
      },
    }))
  }, [updateAndInject])

  const handleTypographyBodyWeightChange = useCallback((value: number) => {
    updateAndInject((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        body: { ...prev.typography.body, weight: value },
      },
    }))
  }, [updateAndInject])

  const handleShadowChange = useCallback((key: string, value: string) => {
    updateAndInject((prev) => ({
      ...prev,
      shadows: { ...prev.shadows, [key]: value },
    }))
  }, [updateAndInject])

  const handleSave = useCallback(() => {
    fetch("/__designflow/update-theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: localTheme }),
    })
  }, [localTheme])

  const handleReset = useCallback(() => {
    const original = deepClone(theme)
    setLocalTheme(original)
    injectThemeCSS(original)
  }, [theme])

  const handleGenerateTailwind = useCallback(() => {
    fetch("/__designflow/generate-tailwind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: localTheme }),
    })
  }, [localTheme])

  return (
    <div
      data-testid="theme-panel"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 320,
        height: "100vh",
        background: "#fff",
        borderLeft: "1px solid #e2e8f0",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Theme</h2>
        <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", padding: 4 }}>
          &times;
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Colors */}
        <Section title="Colors">
          {Object.entries(localTheme.colors).map(([key, value]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input
                type="color"
                data-testid={`color-input-${key}`}
                value={value}
                onInput={(e) => handleColorChange(key, (e.target as HTMLInputElement).value)}
                style={{ width: 32, height: 32, border: "1px solid #e2e8f0", borderRadius: 4, padding: 0, cursor: "pointer" }}
              />
              <label style={{ fontSize: "0.875rem", color: "#475569" }}>{colorLabels[key] || key}</label>
            </div>
          ))}
        </Section>

        {/* Radius */}
        <Section title="Radius">
          {Object.entries(localTheme.radius).map(([key, value]) => (
            <InputRow
              key={key}
              testId={`radius-input-${key}`}
              label={key}
              value={value}
              onChange={(v) => handleRadiusChange(key, v)}
            />
          ))}
        </Section>

        {/* Spacing */}
        <Section title="Spacing">
          {Object.entries(localTheme.spacing).map(([key, value]) => (
            <InputRow
              key={key}
              testId={`spacing-input-${key}`}
              label={key}
              value={value}
              onChange={(v) => handleSpacingChange(key, v)}
            />
          ))}
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <InputRow
            testId="typography-input-fontFamily"
            label="Font Family"
            value={localTheme.typography.fontFamily}
            onChange={handleTypographyFontFamilyChange}
          />
          <InputRow
            testId="typography-input-headingWeight"
            label="Heading Weight"
            value={String(localTheme.typography.heading.weight)}
            onChange={(v) => handleTypographyHeadingWeightChange(Number(v) || 0)}
          />
          <InputRow
            testId="typography-input-bodyWeight"
            label="Body Weight"
            value={String(localTheme.typography.body.weight)}
            onChange={(v) => handleTypographyBodyWeightChange(Number(v) || 0)}
          />
        </Section>

        {/* Shadows */}
        <Section title="Shadows">
          {Object.entries(localTheme.shadows).map(([key, value]) => (
            <InputRow
              key={key}
              testId={`shadow-input-${key}`}
              label={key}
              value={value}
              onChange={(v) => handleShadowChange(key, v)}
            />
          ))}
        </Section>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px", borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSave}
            aria-label="Save"
            style={{
              flex: 1,
              padding: "8px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Save
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset"
            style={{
              flex: 1,
              padding: "8px 16px",
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Reset
          </button>
        </div>
        <button
          onClick={handleGenerateTailwind}
          aria-label="Generate Tailwind"
          style={{
            padding: "8px 16px",
            background: "#f8fafc",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Generate Tailwind
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function InputRow({ testId, label, value, onChange }: { testId: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <label style={{ fontSize: "0.875rem", color: "#475569", width: 90, flexShrink: 0 }}>{label}</label>
      <input
        data-testid={testId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: "4px 8px",
          border: "1px solid #e2e8f0",
          borderRadius: 4,
          fontSize: "0.875rem",
        }}
      />
    </div>
  )
}
