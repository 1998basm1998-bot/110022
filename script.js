const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// جلب البيانات من Local Storage لدعم العمل بدون إنترنت
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// إضافة حركة جديدة
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('يرجى إدخال التفاصيل والمبلغ');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';

    // حركة خفيفة عند الإضافة الناجحة
    gsap.from(list.firstElementChild, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
  }
}

// توليد رقم تعريف عشوائي
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// إضافة الحركة إلى واجهة المستخدم
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount).toLocaleString()} د.ع</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa-solid fa-trash"></i></button>
  `;

  list.insertBefore(item, list.firstChild);
}

// تحديث الرصيد، الإيرادات، والمصروفات
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(0);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(0);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(0);

  balance.innerText = `${Number(total).toLocaleString()} د.ع`;
  money_plus.innerText = `${Number(income).toLocaleString()} د.ع`;
  money_minus.innerText = `${Number(expense).toLocaleString()} د.ع`;
}

// حذف حركة
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// تحديث Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// تهيئة التطبيق
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();

  // تشغيل حركات GSAP عند تحميل الصفحة
  gsap.from(".glass-card", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out"
  });
}

init();
form.addEventListener('submit', addTransaction);
