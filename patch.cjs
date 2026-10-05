const fs = require("fs");

let content = fs.readFileSync("src/components/stash/HostStashVerificationModal.tsx", "utf8");
content = content.replace(
  /const handleSubmit = \(\) => \{[\s\S]*?^\s*\};\s*$/m,
  `  const handleSubmit = async () => {
    if (measuredWeightKg > MAX_ALLOWED_WEIGHT_KG) {
      toast.warning("Weight exceeds 25kg limit! Stash flagged for surcharge.");
    }
    const record = await createAndSaveVerification({ state, bookingId, hostName, campusNode });
    setCompletedRecord(record as any);
    setSavedRecords(getSavedVerifications());
    toast.success("50m Geo-Fenced 3-Point Intake Completed!");
  };`,
);
fs.writeFileSync("src/components/stash/HostStashVerificationModal.tsx", content);
