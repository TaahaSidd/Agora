package com.Agora.Agora.Model.Enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ReportReason {
    @JsonProperty("counterfeit")
    COUNTERFEIT,
    @JsonProperty("misleading")
    MISLEADING,
    @JsonProperty("inappropriate")
    INAPPROPRIATE,
    @JsonProperty("prohibited")
    PROHIBITED,
    @JsonProperty("pricing")
    PRICING,
    @JsonProperty("duplicate")
    DUPLICATE,
    @JsonProperty("spam")
    SPAM,
    @JsonProperty("other")
    OTHER
}
