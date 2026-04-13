<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="app-header__logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#2563EB"/>
          <text x="16" y="22" font-family="Arial" font-size="18" font-weight="bold" fill="white" text-anchor="middle">J</text>
        </svg>
        <span class="app-header__title">Jira Generator</span>
      </div>
      <p class="app-header__subtitle">Генератор заголовков и текстов для Jira</p>
      <div class="app-header__slot">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
}

.app-header__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 0;
  display: flex;
  align-items: center;
  gap: 24px;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.app-header__title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
}

.app-header__subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  flex: 1;
}

.app-header__slot {
  margin-left: auto;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .app-header__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 16px 0;
  }

  .app-header__subtitle {
    padding-left: 38px;
  }

  .app-header__slot {
    width: 100%;
  }
}
</style>
