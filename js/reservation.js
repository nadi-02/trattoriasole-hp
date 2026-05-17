/**
 * Trattoria SOLE - Reservation Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  
  if (!form) return;

  // カレンダー入力UI (Flatpickr) の初期化
  // Initialize Flatpickr for date input
  const dateInput = document.getElementById('date');
  dateInput.setAttribute('placeholder', '選択してください'); // プレースホルダーを設定
  flatpickr(dateInput, {
    locale: 'ja', // 日本語化
    minDate: 'today', // 過去の日付を選択不可に
    disableMobile: "true" // モバイル端末でもFlatpickrのデザインを適用
  });

  // セレクトボックスの未選択時にグレー文字を適用する処理
  // 対象: time, people, course のセレクトボックス
  const selects = form.querySelectorAll('select.form-control');
  selects.forEach(select => {
    // 初期状態で未選択ならplaceholderクラスを付与（グレー表示）
    if (select.value === '') {
      select.classList.add('placeholder');
    }
    // 値が変わったらクラスを切り替え
    select.addEventListener('change', () => {
      if (select.value === '') {
        select.classList.add('placeholder');
      } else {
        select.classList.remove('placeholder');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;

    // バリデーション関数のヘルパー
    // Helper function for validation
    const validateField = (id, condition) => {
      const element = document.getElementById(id);
      const errorElement = document.getElementById(`${id}Error`);
      if (condition) {
        element.style.borderColor = '#e74c3c';
        errorElement.style.display = 'block';
        isValid = false;
      } else {
        element.style.borderColor = '#ddd';
        errorElement.style.display = 'none';
      }
    };

    // 1. 日付のチェック (Date validation)
    validateField('date', !document.getElementById('date').value);

    // 2. 時間のチェック (Time validation)
    validateField('time', document.getElementById('time').value === '');

    // 3. 人数のチェック (People validation)
    validateField('people', document.getElementById('people').value === '');

    // 4. コースのチェック (Course validation)
    validateField('course', document.getElementById('course').value === '');

    // 5. 名前のチェック (Name validation)
    validateField('name', document.getElementById('name').value.trim() === '');

    // 6. 電話番号のチェック (Phone validation - 簡単な正規表現)
    // Simple phone regex matching common Japanese formats
    const phoneValue = document.getElementById('phone').value.replace(/[━.*‐.*―.*－.*\-.*ー.*]/gi, '');
    const phoneRegex = /^[0-9]{10,11}$/;
    validateField('phone', !phoneRegex.test(phoneValue));

    // 7. メールアドレスのチェック (Email validation)
    const emailValue = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField('email', !emailRegex.test(emailValue));

    // 全て有効な場合の処理 (If form is valid)
    if (isValid) {
      // モーダル要素を取得
      const modal = document.getElementById('confirmModal');
      const confirmDetails = document.getElementById('confirmDetails');
      
      // セレクトボックスの選択テキストを取得
      const courseSelect = document.getElementById('course');
      const courseText = courseSelect.options[courseSelect.selectedIndex].text;
      const peopleSelect = document.getElementById('people');
      const peopleText = peopleSelect.options[peopleSelect.selectedIndex].text;

      // 入力内容をHTMLに整形して挿入
      confirmDetails.innerHTML = `
        <div class="confirm-row"><div class="confirm-label">ご希望日</div><div class="confirm-value">${document.getElementById('date').value}</div></div>
        <div class="confirm-row"><div class="confirm-label">ご希望時間</div><div class="confirm-value">${document.getElementById('time').value}</div></div>
        <div class="confirm-row"><div class="confirm-label">人数</div><div class="confirm-value">${peopleText}</div></div>
        <div class="confirm-row"><div class="confirm-label">コース</div><div class="confirm-value">${courseText}</div></div>
        <div class="confirm-row"><div class="confirm-label">お名前</div><div class="confirm-value">${document.getElementById('name').value}</div></div>
        <div class="confirm-row"><div class="confirm-label">お電話番号</div><div class="confirm-value">${document.getElementById('phone').value}</div></div>
        <div class="confirm-row"><div class="confirm-label">メールアドレス</div><div class="confirm-value">${document.getElementById('email').value}</div></div>
        <div class="confirm-row"><div class="confirm-label">アレルギー等</div><div class="confirm-value">${document.getElementById('requests').value.replace(/\n/g, '<br>') || 'なし'}</div></div>
      `;
      
      // モーダルを表示
      modal.classList.add('show');
    }
  });

  // モーダル関連のイベントリスナー
  const modal = document.getElementById('confirmModal');
  const btnModify = document.getElementById('btnModify');
  const modalClose = document.getElementById('modalClose');
  const btnSubmitConfirm = document.getElementById('btnSubmitConfirm');

  // 閉じる・修正するボタン
  const closeModal = () => modal.classList.remove('show');
  if(btnModify) btnModify.addEventListener('click', closeModal);
  if(modalClose) modalClose.addEventListener('click', closeModal);
  
  // モーダル外枠クリックで閉じる
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // モーダル内の「送信する」ボタン
  if(btnSubmitConfirm) {
    btnSubmitConfirm.addEventListener('click', () => {
      closeModal();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = '送信中...';

      // 送信をシミュレート (Simulate API request)
      setTimeout(() => {
        submitBtn.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // フォームをリセット
        form.reset();
      }, 1000);
    });
  }
  
  // 入力時のリアルタイムバリデーション解除 (Remove errors on input)
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '#ddd';
      const errorEl = document.getElementById(`${input.id}Error`);
      if (errorEl) errorEl.style.display = 'none';
    });
  });
});
