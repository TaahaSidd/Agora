package com.Agora.Agora.Model.Enums;

import com.fasterxml.jackson.annotation.JsonProperty;
public enum ReportReason {
    // Listing Specific
    @JsonProperty("counterfeit") COUNTERFEIT,
    @JsonProperty("misleading") MISLEADING,
    @JsonProperty("pricing") PRICING,
    @JsonProperty("duplicate") DUPLICATE,
    @JsonProperty("prohibited") PROHIBITED,

    // User Specific
    @JsonProperty("harassment") HARASSMENT,
    @JsonProperty("fake") FAKE,
    @JsonProperty("scam") SCAM,

    // Common
    @JsonProperty("inappropriate") INAPPROPRIATE,
    @JsonProperty("spam") SPAM,
    @JsonProperty("other") OTHER
}
