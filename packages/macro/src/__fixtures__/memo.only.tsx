import { getNode } from "@magical-types/macro";
import { Component } from "react";

let x = getNode<{ thing: typeof Component }>();
