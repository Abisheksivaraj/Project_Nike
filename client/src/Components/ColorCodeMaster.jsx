import React, { useState, useEffect, useRef } from "react";

const ColorCodeMaster = () => {
  const [color, setColor] = useState("#3498db");
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hue, setHue] = useState(210); // Default blue
  const [recentColors, setRecentColors] = useState([
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
  ]);
  const [displayFormat, setDisplayFormat] = useState("hex");
  const [colorName, setColorName] = useState("");
  const [savedColors, setSavedColors] = useState([]);

  const saturationRef = useRef(null);
  const lightnessRef = useRef(null);
  const hueRef = useRef(null);

  // Update main color when HSL changes
  useEffect(() => {
    updateColorFromHSL();
  }, [hue, saturation, lightness]);

  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r, g, b;

    if (0 <= h && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    const toHex = (value) => {
      const hex = Math.round((value + m) * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert Hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  // Convert Hex to HSL
  const hexToHsl = (hex) => {
    const { r, g, b } = hexToRgb(hex);

    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;

    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);

    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r1:
          h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
          break;
        case g1:
          h = (b1 - r1) / d + 2;
          break;
        case b1:
          h = (r1 - g1) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Update HSL values from hex color
  const updateHSLFromHex = (hexColor) => {
    const { h, s, l } = hexToHsl(hexColor);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  };

  // Update color from HSL values
  const updateColorFromHSL = () => {
    const newColor = hslToHex(hue, saturation, lightness);
    setColor(newColor);
  };

  // Handle hex input change
  const handleHexChange = (e) => {
    const newColor = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setColor(newColor);
      updateHSLFromHex(newColor);
      addToRecentColors(newColor);
    }
  };

  // Copy color to clipboard
  const copyToClipboard = (format) => {
    let textToCopy;

    switch (format) {
      case "hex":
        textToCopy = color;
        break;
      case "rgb": {
        const { r, g, b } = hexToRgb(color);
        textToCopy = `rgb(${r}, ${g}, ${b})`;
        break;
      }
      case "hsl":
        textToCopy = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        break;
      default:
        textToCopy = color;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert(`Copied ${textToCopy} to clipboard!`);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Add color to recent colors
  const addToRecentColors = (newColor) => {
    if (!recentColors.includes(newColor)) {
      const updatedColors = [newColor, ...recentColors.slice(0, 4)];
      setRecentColors(updatedColors);
    }
  };

  // Select recent color
  const selectRecentColor = (selectedColor) => {
    setColor(selectedColor);
    updateHSLFromHex(selectedColor);
  };

  // Handle hue change
  const handleHueMouseDown = () => {
    const handleHueChange = (e) => {
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newHue = Math.round((x / rect.width) * 360);
      setHue(newHue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleHueChange);
      document.removeEventListener("mouseup", handleMouseUp);
      // Add to recent colors after sliding is done
      addToRecentColors(color);
    };

    document.addEventListener("mousemove", handleHueChange);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle saturation change
  const handleSaturationMouseDown = () => {
    const handleSaturationChange = (e) => {
      const rect = saturationRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newSaturation = Math.round((x / rect.width) * 100);
      setSaturation(newSaturation);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleSaturationChange);
      document.removeEventListener("mouseup", handleMouseUp);
      // Add to recent colors after sliding is done
      addToRecentColors(color);
    };

    document.addEventListener("mousemove", handleSaturationChange);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle lightness change
  const handleLightnessMouseDown = () => {
    const handleLightnessChange = (e) => {
      const rect = lightnessRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newLightness = Math.round((x / rect.width) * 100);
      setLightness(newLightness);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleLightnessChange);
      document.removeEventListener("mouseup", handleMouseUp);
      // Add to recent colors after sliding is done
      addToRecentColors(color);
    };

    document.addEventListener("mousemove", handleLightnessChange);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Get text color for contrast
  const getTextColor = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return "#000000";

    const brightness = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  // Get display value based on format
  const getDisplayValue = () => {
    const { r, g, b } = hexToRgb(color);

    switch (displayFormat) {
      case "hex":
        return color;
      case "rgb":
        return `rgb(${r}, ${g}, ${b})`;
      case "hsl":
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      default:
        return color;
    }
  };

  // Define common colors
  const commonColors = [
    { name: "Red", hex: "#e74c3c" },
    { name: "Orange", hex: "#f39c12" },
    { name: "Yellow", hex: "#f1c40f" },
    { name: "Green", hex: "#2ecc71" },
    { name: "Blue", hex: "#3498db" },
    { name: "Purple", hex: "#9b59b6" },
    { name: "Pink", hex: "#e84393" },
    { name: "Teal", hex: "#1abc9c" },
    { name: "Gray", hex: "#95a5a6" },
    { name: "Black", hex: "#2c3e50" },
  ];

  // Add current color to saved colors
  const addToSavedColors = () => {
    if (colorName.trim() === "") {
      alert("Please enter a name for this color");
      return;
    }

    const newSavedColor = {
      name: colorName,
      hex: color,
    };

    setSavedColors([...savedColors, newSavedColor]);
    setColorName(""); // Clear the input
  };

  // Remove a saved color
  const removeSavedColor = (index) => {
    const updatedColors = [...savedColors];
    updatedColors.splice(index, 1);
    setSavedColors(updatedColors);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Color Picker Area */}
      <div className="w-3/4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 h-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Color Picker</h1>

          <div className="grid grid-cols-5 gap-4">
            {/* Left Column - Color Display and Controls */}
            <div className="col-span-3">
              {/* Color Display */}
              <div
                className="h-32 rounded-lg flex items-center justify-center mb-4 shadow-inner"
                style={{ backgroundColor: color, color: getTextColor(color) }}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold">
                    {getDisplayValue()}
                  </span>
                  <div className="mt-2">
                    <select
                      value={displayFormat}
                      onChange={(e) => setDisplayFormat(e.target.value)}
                      className="bg-white bg-opacity-20 rounded p-1 text-sm"
                    >
                      <option value="hex">HEX</option>
                      <option value="rgb">RGB</option>
                      <option value="hsl">HSL</option>
                    </select>
                    <button
                      onClick={() => copyToClipboard(displayFormat)}
                      className="ml-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 text-sm transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                <div className="space-y-4">
                  {/* Hex Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hex Value
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={handleHexChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Hue Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hue: {hue}°
                    </label>
                    <div
                      ref={hueRef}
                      className="h-5 w-full rounded-md cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                      }}
                      onMouseDown={handleHueMouseDown}
                    >
                      <div
                        className="w-3 h-7 bg-white border border-gray-400 rounded-full shadow-md transform -translate-y-1"
                        style={{
                          marginLeft: `calc(${(hue / 360) * 100}% - 6px)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Saturation Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saturation: {saturation}%
                    </label>
                    <div
                      ref={saturationRef}
                      className="h-5 w-full rounded-md cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${hslToHex(hue, 0, lightness)}, ${hslToHex(hue, 100, lightness)})`,
                      }}
                      onMouseDown={handleSaturationMouseDown}
                    >
                      <div
                        className="w-3 h-7 bg-white border border-gray-400 rounded-full shadow-md transform -translate-y-1"
                        style={{
                          marginLeft: `calc(${saturation}% - 6px)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Lightness Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lightness: {lightness}%
                    </label>
                    <div
                      ref={lightnessRef}
                      className="h-5 w-full rounded-md cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #000000, ${hslToHex(hue, saturation, 50)}, #ffffff)`,
                      }}
                      onMouseDown={handleLightnessMouseDown}
                    >
                      <div
                        className="w-3 h-7 bg-white border border-gray-400 rounded-full shadow-md transform -translate-y-1"
                        style={{
                          marginLeft: `calc(${lightness}% - 6px)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Recent and Common Colors */}
            <div className="col-span-2">
              {/* Recent Colors */}
              <div className="mb-4">
                <h2 className="text-md font-semibold mb-2">Recent Colors</h2>
                <div className="grid grid-cols-5 gap-2">
                  {recentColors.map((recentColor, index) => (
                    <div
                      key={index}
                      className="h-8 rounded-md cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: recentColor }}
                      onClick={() => selectRecentColor(recentColor)}
                      title={recentColor}
                    />
                  ))}
                </div>
              </div>

              {/* Common Colors */}
              <div>
                <h2 className="text-md font-semibold mb-2">Common Colors</h2>
                <div className="grid grid-cols-2 gap-2">
                  {commonColors.map((commonColor, index) => (
                    <div
                      key={index}
                      className="h-8 rounded-md cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
                      style={{
                        backgroundColor: commonColor.hex,
                        color: getTextColor(commonColor.hex),
                      }}
                      onClick={() => selectRecentColor(commonColor.hex)}
                      title={commonColor.name}
                    >
                      <span className="text-xs font-medium">
                        {commonColor.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Save Color Section */}
                <div className="bg-gray-50 mt-10 p-4 rounded-lg shadow-sm">
                  <h3 className="text-md font-semibold mb-2">
                    Save This Color
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="Enter color name"
                      className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addToSavedColors}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Colors Panel */}
      <div className="w-1/4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 h-full">
          <h2 className="text-xl font-bold mb-4">My Color Collection</h2>

          {savedColors.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              Add colors to your collection by selecting a color and clicking
              "Add"
            </div>
          ) : (
            <div className="space-y-2 max-h-full overflow-y-auto">
              {savedColors.map((savedColor, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 rounded-md p-2 hover:bg-gray-100"
                >
                  <div
                    className="h-8 w-8 rounded-md mr-2 flex-shrink-0"
                    style={{ backgroundColor: savedColor.hex }}
                  />
                  <div className="flex-grow">
                    <div className="font-medium">{savedColor.name}</div>
                    <div className="text-xs text-gray-500">
                      {savedColor.hex}
                    </div>
                  </div>
                  <button
                    onClick={() => selectRecentColor(savedColor.hex)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-1"
                    title="Use this color"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => removeSavedColor(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Remove from collection"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorCodeMaster;
