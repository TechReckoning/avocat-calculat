// Fragment HTML pentru formularul de feedback
const feedbackFormHTML = `
<form action="https://formsubmit.co/day.licious@yahoo.com" method="POST" class="feedback-form">
  <input type="hidden" name="_next" value="/pages/multumim.html">
  <input type="hidden" name="_captcha" value="false">
  <h3>Trimite feedback anonim</h3>
  <div class="feedback-message-group">
    <label for="mesaj">Mesajul tău *</label>
    <textarea id="mesaj" name="mesaj" required rows="4" placeholder="Scrie aici feedbackul tău..."></textarea>
  </div>
  <button type="submit">Trimite feedback</button>
</form>
`;

// Funcție pentru inserarea formularului în footer
function insertFeedbackForm() {
  const footer = document.querySelector('footer');
  if (footer) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = feedbackFormHTML;
    wrapper.style.marginTop = '32px';
    footer.appendChild(wrapper);
  }
}

document.addEventListener('DOMContentLoaded', insertFeedbackForm); 