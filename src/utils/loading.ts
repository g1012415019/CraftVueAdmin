export class AppLoader {
  private static loadingEl: HTMLElement | null = null
  private static appEl: HTMLElement | null = null

  static init() {
    this.loadingEl = document.getElementById('loading')
    this.appEl = document.getElementById('app')
  }

  static hide() {
    if (!this.loadingEl || !this.appEl) return

    this.appEl.classList.add('loaded')
    
    setTimeout(() => {
      if (this.loadingEl) {
        this.loadingEl.style.opacity = '0'
        setTimeout(() => this.loadingEl?.remove(), 300)
      }
    }, 100)
  }
}
