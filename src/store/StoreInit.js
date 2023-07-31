"use client";

import { useRef } from "react";
import { useUser, useDataStore } from ".";

export function UserInit({ data }) {
  const initialize = useRef(false);
  if (!initialize.current) {
    useUser.setState({ user: data.user });
    initialize.current = true;
  }
  return null;
}

export function DataInit({ data }) {
  const initialize = useRef(false);
  if (!initialize.current) {
    useDataStore.setState({ data });
    initialize.current = true;
  }
  return null;
}
