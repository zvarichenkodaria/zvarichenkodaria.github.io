document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.menu-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');
      headers.forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
      });
      if (!isActive) {
        header.classList.add('active');
        header.nextElementSibling.classList.add('active');
      }
    });
  });

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://example.com",
    dotsOptions: { color: "#000000", type: "square" },
    cornersSquareOptions: { type: "square", color: "#000000" },
    cornersDotOptions: { type: "dot", color: "#000000" },
    backgroundOptions: { color: "#ffffff" },
    margin: 5,
    qrOptions: { errorCorrectionLevel: "M" }
  });
  const container = document.getElementById("qr-code");
  qrCode.append(container);

  const urlInput = document.getElementById("urlInput");
  const dotColor = document.getElementById("dotColor");
  const dotColorHex = document.getElementById("dotColorHex");
  const bgColor = document.getElementById("bgColor");
  const bgColorHex = document.getElementById("bgColorHex");
  const bgTransparency = document.getElementById("bgTransparency");
  const dotShape = document.getElementById("dotShape");
  const markerShape = document.getElementById("markerShape");
  const logoInput = document.getElementById("logoInput");
  const logoFile = document.getElementById("logoFile");
  const logoPreview = document.getElementById("logoPreview");
  const removeLogoBtn = document.getElementById("removeLogo");
  const logoSize = document.getElementById("logoSize");
  const errorLevel = document.getElementById("errorLevel");
  const logoOverlay = document.getElementById("logoOverlay");
  const exportButtons = document.getElementById("exportButtons");
  const seedArea = document.getElementById("seedArea");
  const copySettingsBtn = document.getElementById("copySettings");
  const loadSettingsBtn = document.getElementById("loadSettingsBtn");
  const messageBox = document.getElementById("messageBox");

  let logoData = "";
  let updateTimer;

  function showMessage(message, isError = false) {
    messageBox.textContent = message;
    if (isError) messageBox.classList.add("error");
    else messageBox.classList.remove("error");
    messageBox.style.opacity = "1";
    messageBox.style.pointerEvents = "auto";
    setTimeout(() => {
      messageBox.style.opacity = "0";
      messageBox.style.pointerEvents = "none";
    }, 2500);
  }

  // Палитра - синхронизация с вызовом обновления только при hex изменении
  function syncColorInputs(colorInput, hexInput) {
    colorInput.addEventListener("input", () => {
      hexInput.value = colorInput.value;
      delayedUpdateQR();
    });
    hexInput.addEventListener("input", () => {
      const val = hexInput.value.trim();
      if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
        colorInput.value = val;
        delayedUpdateQR();
      }
    });
  }
  syncColorInputs(dotColor, dotColorHex);
  syncColorInputs(bgColor, bgColorHex);

  function updateLogoOverlay() {
    if (!logoOverlay) return;
    if (logoData && logoData.trim() !== "") {
      logoOverlay.src = logoData;
      logoOverlay.style.display = "block";
      let sizePerc = Math.min(Math.max(parseFloat(logoSize.value) || 15, 1), 50);
      logoOverlay.style.maxWidth = sizePerc + "%";
      logoOverlay.style.height = "auto";
    } else {
      logoOverlay.style.display = "none";
    }
  }

  function updateLogoDisplay() {
    if (logoData) {
      logoPreview.src = logoData;
      logoPreview.style.display = "block";
      removeLogoBtn.style.display = "inline-block";
      logoInput.style.display = "none";
      logoFile.style.display = "none";
    } else {
      logoPreview.style.display = "none";
      removeLogoBtn.style.display = "none";
      logoInput.style.display = "block";
      logoFile.style.display = "block";
      logoInput.value = "";
      logoFile.value = "";
    }
  }

  function updateQR() {
    const data = urlInput.value.trim();
    const sizePercent = Math.min(Math.max(parseFloat(logoSize.value) || 15, 1), 25);
    const qrWidth = 300;
    const aspectRatio = 50 / 96;
    const logoWidth = Math.round(qrWidth * (sizePercent / 100));
    const logoHeight = Math.round(logoWidth * aspectRatio);

    qrCode.update({
      data: data || "",
      dotsOptions: { color: dotColor.value, type: dotShape.value },
      cornersSquareOptions: { type: markerShape.value, color: dotColor.value },
      cornersDotOptions: { type: markerShape.value, color: dotColor.value },
      backgroundOptions: { color: bgTransparency.checked ? "transparent" : bgColor.value },
      qrOptions: { errorCorrectionLevel: errorLevel.value },
      image: logoData,
      imageOptions: { width: logoWidth, height: logoHeight, crossOrigin: 'anonymous' }
    });

    updateLogoDisplay();
    updateLogoOverlay();

    const settings = {
      data: data || "",
      dotColor: dotColor.value,
      dotColorHex: dotColorHex.value,
      bgColor: bgColor.value,
      bgColorHex: bgColorHex.value,
      bgTransparency: bgTransparency.checked,
      dotShape: dotShape.value,
      markerShape: markerShape.value,
      logoUrl: logoInput.value,
      logoBase64: logoData,
      logoSize: logoSize.value,
      errorLevel: errorLevel.value
    };
    seedArea.value = btoa(JSON.stringify(settings));
    exportButtons.style.display = "flex";
  }

  // Задержка обновления QR чтобы обработать последние изменения
  function delayedUpdateQR() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updateQR();
    }, 1000);
  }

  // Слушатели
  urlInput.addEventListener("input", delayedUpdateQR);
  logoInput.addEventListener("input", delayedUpdateQR);
  logoFile.addEventListener("change", () => {
    const file = logoFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      logoData = e.target.result || "";
      logoInput.value = "";
      delayedUpdateQR();
    };
    reader.readAsDataURL(file);
  });
  removeLogoBtn.addEventListener("click", () => {
    logoData = "";
    logoInput.value = "";
    logoFile.value = "";
    delayedUpdateQR();
  });
  logoSize.addEventListener("input", delayedUpdateQR);
  dotColor.addEventListener("input", delayedUpdateQR);
  dotColorHex.addEventListener("input", delayedUpdateQR);
  bgColor.addEventListener("input", delayedUpdateQR);
  bgColorHex.addEventListener("input", delayedUpdateQR);
  bgTransparency.addEventListener("change", delayedUpdateQR);
  dotShape.addEventListener("change", delayedUpdateQR);
  markerShape.addEventListener("change", delayedUpdateQR);
  errorLevel.addEventListener("change", delayedUpdateQR);

  // Копирование seed
  copySettingsBtn.addEventListener("click", () => {
    seedArea.select();
    try {
      document.execCommand("copy");
      showMessage("Код настроек скопирован в буфер обмена");
    } catch {
      showMessage("Ошибка копирования", true);
    }
    window.getSelection().removeAllRanges();
  });

  // Загрузка seed
  loadSettingsBtn.addEventListener("click", () => {
    try {
      const settings = JSON.parse(atob(seedArea.value));
      urlInput.value = settings.data || "";
      dotColor.value = settings.dotColor || "#000000";
      dotColorHex.value = settings.dotColorHex || "#000000";
      bgColor.value = settings.bgColor || "#ffffff";
      bgColorHex.value = settings.bgColorHex || "#ffffff";
      bgTransparency.checked = settings.bgTransparency || false;
      dotShape.value = settings.dotShape || "square";
      markerShape.value = settings.markerShape || "square";
      logoInput.value = settings.logoUrl || "";
      logoData = settings.logoBase64 || "";
      logoSize.value = settings.logoSize || 15;
      errorLevel.value = settings.errorLevel || "M";
      delayedUpdateQR();
      showMessage("Код настроек успешно загружен");
    } catch {
      showMessage("Некорректный код настроек", true);
    }
  });

  // Export
  exportButtons.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const ext = btn.getAttribute("data-type");
      qrCode.download({ extension: ext, name: "qr-code" });
    });
  });

  // Инициализация seed и QR
  delayedUpdateQR();
});
