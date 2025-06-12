// src/utils/sanitizeOklch.js

// ✅ Hàm loại bỏ tất cả thuộc tính màu có chứa "oklch"
export function removeOKLCHColors(container) {
    const isOKLCH = (val) => typeof val === "string" && val.includes("oklch");

    const sanitizeStyle = (el) => {
        const computed = getComputedStyle(el);
        const props = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderBottomColor",
            "borderLeftColor",
            "borderRightColor",
            "outlineColor",
            "boxShadow",
        ];

        props.forEach((prop) => {
            const val = computed[prop];
            if (isOKLCH(val)) {
                el.style.setProperty(prop, "transparent", "important");
            }
        });

        // Gỡ biến CSS nếu chứa oklch
        for (const key of Object.keys(computed)) {
            const val = computed.getPropertyValue?.(key);
            if (isOKLCH(val)) {
                el.style.setProperty(key, "transparent", "important");
            }
        }
    };

    const allElements = container.querySelectorAll("*");
    allElements.forEach((el) => sanitizeStyle(el));
}