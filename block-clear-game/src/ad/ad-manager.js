// game/src/ad/ad-manager.js
export class AdManager {
  constructor() {
    this.usedThisRound = false
  }

  showRewardedAd(onSuccess, onFail) {
    if (this.usedThisRound) {
      onFail('already_used')
      return
    }

    // H5 stub: 用 confirm 模拟（微信小游戏时替换为 wx.createRewardedVideoAd）
    const watched = window.confirm('[模拟广告] 点击确定模拟看完广告')
    if (watched) {
      this.usedThisRound = true
      onSuccess()
    } else {
      onFail('user_cancelled')
    }
  }

  resetRound() {
    this.usedThisRound = false
  }

  canShowAd() {
    return !this.usedThisRound
  }
}
