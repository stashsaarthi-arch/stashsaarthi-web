const fs = require('fs');

let hsv = fs.readFileSync('src/components/stash/HostStashVerificationModal.tsx', 'utf8');

const oldStr = `const createAndSaveVerification = (state: any, bookingId?: any, hostName?: any, campusNode?: any) => ({
    success: true, message: "Verification Saved",
    id: "1", hostName: "host", campusNode: "node", sealIntact: true, barcodeSerial: "123", measuredWeightKg: 10, maxAllowedWeightKg: 25, timestamp: new Date().toISOString(), isValid: true
  });
  await supabase.from("damage_reports").insert({ notes: "Host Verification saved: " + bookingId });
  return { success: true, message: "Verification Saved" };
};`;

const newStr = `const createAndSaveVerification = async (state: any, bookingId?: any, hostName?: any, campusNode?: any) => {
  await supabase.from("damage_reports").insert({ notes: "Host Verification saved: " + bookingId });
  return {
    success: true, message: "Verification Saved",
    id: "1", hostName: "host", campusNode: "node", sealIntact: true, barcodeSerial: "123", measuredWeightKg: 10, maxAllowedWeightKg: 25, timestamp: new Date().toISOString(), isValid: true
  };
};`;

hsv = hsv.replace(oldStr, newStr);

fs.writeFileSync('src/components/stash/HostStashVerificationModal.tsx', hsv);
