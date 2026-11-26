"use client";

import { useEffect } from "react";
import { useDataStore } from ".";

export function DataInit({ data }) {
  useEffect(() => {
    useDataStore.setState({ data });
  }, [data]);

  return null;
}
