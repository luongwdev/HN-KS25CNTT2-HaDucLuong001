// ===== Biến trạng thái dùng chung cho toàn chương trình =====
let currentGateCode = "";
let isGateValid = false;
let totalRevenue = 0;
let totalGateSales = 0;

// ===== Hằng số nghiệp vụ dùng chung =====
const MIN_CODE_LENGTH = 6;
const CODE_PREFIX = "PRK-";
const COMBO_MIN_RIDES = 4;
const COMBO_DISCOUNT_RATE = 0.1;
const INSURANCE_RATE = 0.08;
const BORDER_LENGTH = 50;

const MENU_TEXT = [
  "=".repeat(53),
  "     HỆ THỐNG BÁN VÉ KHU VUI CHƠI DREAM PARK",
  "=".repeat(53),
  "1. Nhập và kiểm chuẩn mã vé cổng",
  "2. Tính tiền vé trò chơi",
  "3. Thẩm định mã vé cổng may mắn",
  "0. Thoát chương trình",
  "=".repeat(53),
].join("\n");

// ===== Tiện ích trong ứng dụng =====

const readInput = (message) => {
  const rawInput = prompt(message);
  return rawInput === null ? null : rawInput.trim();
};

const formatCurrency = (amount) => `${amount.toLocaleString("vi-VN")} VNĐ`;

const readPositiveInteger = (message) => {
  while (true) {
    const input = readInput(message);

    if (input === null) {
      return null;
    }

    const value = Number(input);
    if (/^\d+$/.test(input) && Number.isSafeInteger(value) && value > 0) {
      return value;
    }
    console.log("Lỗi: Vui lòng nhập số nguyên lớn hơn 0.");
  }
};

// ===== Case 1: Nhập và kiểm chuẩn mã vé cổng =====

const getGateCodeError = (code) => {
  if (code.length < MIN_CODE_LENGTH) {
    return `Độ dài nhỏ hơn ${MIN_CODE_LENGTH} ký tự`;
  }
  if (!code.startsWith(CODE_PREFIX)) {
    return `Sai tiền tố "${CODE_PREFIX}"`;
  }
  if (/\s/.test(code)) {
    return "Chứa khoảng trắng ở giữa";
  }
  return "";
};

const handleGateCodeInput = () => {
  currentGateCode = "";
  isGateValid = false;

  const input = readInput("Nhập mã vé cổng:");
  const normalizedCode = input === null ? "" : input.toUpperCase();

  if (normalizedCode === "") {
    console.log("Chưa nhập mã vé cổng");
    return;
  }

  const errorMessage = getGateCodeError(normalizedCode);
  if (errorMessage !== "") {
    console.log(`Lỗi: ${errorMessage}`);
    return;
  }

  currentGateCode = normalizedCode;
  isGateValid = true;
  console.log(`Mã vé cổng "${currentGateCode}" hợp lệ.`);
};

// ===== Case 2: Tính tiền vé trò chơi =====

const calculateBill = (rideCount, pricePerRide) => {
  const baseCost = rideCount * pricePerRide;
  const discount =
    rideCount >= COMBO_MIN_RIDES ? Math.round(baseCost * COMBO_DISCOUNT_RATE) : 0;
  const insuranceFee = Math.round((baseCost - discount) * INSURANCE_RATE);
  const totalPayment = baseCost - discount + insuranceFee;

  return { baseCost, discount, insuranceFee, totalPayment };
};

const printRideInvoice = (rideCount, pricePerRide, bill) => {
  console.log("=".repeat(BORDER_LENGTH));
  console.log("HÓA ĐƠN VÉ TRÒ CHƠI");
  console.log("=".repeat(BORDER_LENGTH));
  console.log(`Mã vé cổng         : ${currentGateCode}`);
  console.log(`Số vé trò chơi     : ${rideCount}`);
  console.log(`Giá mỗi vé         : ${formatCurrency(pricePerRide)}`);
  console.log(`Chi phí cơ sở      : ${formatCurrency(bill.baseCost)}`);
  console.log(`Tiền giảm giá      : ${formatCurrency(bill.discount)}`);
  console.log(`Phí bảo hiểm tai nạn: ${formatCurrency(bill.insuranceFee)}`);
  console.log(`Tổng thanh toán    : ${formatCurrency(bill.totalPayment)}`);
  console.log("=".repeat(BORDER_LENGTH));
};

const handleRidePayment = () => {
  if (!isGateValid) {
    console.log("Chưa có mã vé cổng hợp lệ. Vui lòng chọn chức năng 1 trước.");
    return;
  }

  const rideCount = readPositiveInteger("Nhập số vé trò chơi:");
  if (rideCount === null) {
    console.log("Đã hủy giao dịch.");
    return;
  }

  const pricePerRide = readPositiveInteger("Nhập giá mỗi vé trò chơi (VNĐ):");
  if (pricePerRide === null) {
    console.log("Đã hủy giao dịch.");
    return;
  }

  const bill = calculateBill(rideCount, pricePerRide);

  totalRevenue += bill.totalPayment;
  totalGateSales += 1;

  printRideInvoice(rideCount, pricePerRide, bill);

  currentGateCode = "";
  isGateValid = false;
};

// ===== Case 3: Thẩm định mã vé cổng may mắn =====

const isValidSerial = (serial) => /^\d{2,}$/.test(serial) && !/^0+$/.test(serial);

const sumDigits = (serial) => {
  let digitSum = 0;
  for (const digit of serial) {
    digitSum += Number(digit);
  }
  return digitSum;
};

const getPrize = (isPalindrome, isDivisibleByNine) => {
  if (isPalindrome && isDivisibleByNine) {
    return "Giải Đặc biệt: Vé trọn gói cả ngày cho 2 người trị giá 800.000 VNĐ";
  }
  if (isPalindrome) {
    return "Giải Nhất: Ảnh lưu niệm in khung trị giá 100.000 VNĐ";
  }
  if (isDivisibleByNine) {
    return "Giải Nhì: Voucher giảm 25.000 VNĐ cho lần mua vé kế tiếp";
  }
  return "Không trúng thưởng";
};

const handleLuckyCheck = () => {
  const serial = readInput("Nhập số seri trên vé cổng:");

  if (serial === null || !isValidSerial(serial)) {
    console.log("Lỗi: Số seri chỉ gồm chữ số, tối thiểu 2 chữ số và không toàn số 0.");
    return;
  }

  const reversedSerial = [...serial].reverse().join("");
  const isPalindrome = serial === reversedSerial;
  const digitSum = sumDigits(serial);
  const isDivisibleByNine = digitSum % 9 === 0;

  console.log(`Mã số gốc       : ${serial}`);
  console.log(`Mã đảo ngược    : ${reversedSerial}`);
  console.log(`Tổng chữ số     : ${digitSum}`);
  console.log(`Chia hết cho 9  : ${isDivisibleByNine ? "Có" : "Không"}`);
  console.log(`Giải thưởng     : ${getPrize(isPalindrome, isDivisibleByNine)}`);
};

// ===== Báo cáo tổng kết ca =====

const printShiftReport = () => {
  console.log("=".repeat(BORDER_LENGTH));
  console.log("BÁO CÁO TỔNG KẾT CA BÁN VÉ");
  console.log("=".repeat(BORDER_LENGTH));

  if (totalGateSales === 0) {
    console.log("Chưa phát sinh lượt bán vé nào trong ca");
  } else {
    const averageRevenue = Math.round(totalRevenue / totalGateSales);
    console.log(`Tổng số lượt bán vé đã thanh toán : ${totalGateSales}`);
    console.log(`Tổng doanh thu                    : ${formatCurrency(totalRevenue)}`);
    console.log(`Doanh thu trung bình              : ${formatCurrency(averageRevenue)}`);
  }

  console.log("=".repeat(BORDER_LENGTH));
};

const runMenu = () => {
  let isRunning = true;

  while (isRunning) {
    console.log(MENU_TEXT);
    const choice = readInput("Vui lòng nhập lựa chọn của bạn (0 - 3):");

    switch (choice) {
      case "1":
        handleGateCodeInput();
        break;
      case "2":
        handleRidePayment();
        break;
      case "3":
        handleLuckyCheck();
        break;
      case "0":
        printShiftReport();
        console.log("Cảm ơn bạn đã sử dụng hệ thống. Hẹn gặp lại!");
        isRunning = false;
        break;
      default:
        console.log("Lựa chọn không hợp lệ. Vui lòng nhập số từ 0 đến 3.");
        break;
    }
  }
};

runMenu();