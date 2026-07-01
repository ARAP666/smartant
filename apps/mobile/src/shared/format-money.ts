export function formatMoney(amountMinor: string, currency = "CRC") {
  return new Intl.NumberFormat("es-CR", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(amountMinor) / 100);
}
