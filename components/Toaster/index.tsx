import { Box } from "native-base";
import React from "react";

const Toaster = (statement) => {
  return (
    <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
      {statement}
    </Box>
  );
};

export default Toaster;
