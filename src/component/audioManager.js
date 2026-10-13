// ========================================
// GLOBAL AUDIO MANAGER
// صوت واحد فقط يشتغل بنفس الوقت
// (حتى لو من كومبونينتس مختلفة بنفس الصفحة)
// ========================================

/*
  current = {
    audio,    // كائن Audio الشغّال
    finish,   // بيستدعي onFinish مرة وحدة (انتهى / انوقف / فشل)
    owner,    // مين شغّله (اختياري، للـ cleanup)
  }
*/
let current = null;

// ----------------------------------------
// STOP
// بدون owner: يوقف أي صوت شغّال
// مع owner: يوقف الصوت بس إذا هو الي شغّله
// ----------------------------------------

export const stopGlobalAudio = (owner) => {
  if (!current) return;

  if (owner !== undefined && current.owner !== owner) return;

  const { audio, finish } = current;

  current = null;

  audio.onended = null;
  audio.onerror = null;

  audio.pause();
  audio.currentTime = 0;

  finish();
};

// ----------------------------------------
// PLAY
// أي صوت جديد بيوقف الصوت القديم أول
// ----------------------------------------

export const playGlobalAudio = (src, { owner, onFinish } = {}) => {
  stopGlobalAudio();

  if (!src) return;

  const audio = new Audio(src);

  let done = false;

  const finish = () => {
    if (done) return;

    done = true;

    if (current && current.audio === audio) {
      current = null;
    }

    onFinish?.();
  };

  current = { audio, finish, owner };

  audio.onended = finish;
  audio.onerror = finish;

  audio.play().catch(finish);
};