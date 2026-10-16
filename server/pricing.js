const round = (n) => Math.round(n * 100) / 100;

export const computeBreakdown = ({ roomRate = 0, fees = {}, nights = 0, guests = {} }) => {
  const roomTotal = roomRate * nights;
  const cleaningFee = fees.cleaningFee ?? 0;
  const serviceFee = fees.serviceFee ?? 0;
  const petFee = guests.pets > 0 ? fees.pet ?? 0 : 0;
  const childDiscount = guests.children > 0 ? fees.childDiscount ?? 0 : 0;

  const subtotal = Math.max(
    0,
    roomTotal + cleaningFee + serviceFee + petFee - childDiscount
  );
  const tax = round(subtotal * ((fees.tax ?? 0) / 100));

  return {
    roomTotal, cleaningFee, serviceFee, petFee, childDiscount,
    subtotal, tax, total: round(subtotal + tax),
  };
};