## Places API: Retrieve Ratings and Reviews

This guide details how to retrieve place ratings, review counts, and detailed
user reviews using the Places Web Service (New). All requests require specifying
a field mask to return the desired data.

### Prerequisites

1.  **API Key Setup**: Ensure the `GOOGLE_API_KEY` is configured in your
    execution environment.
2.  **Billing**: Accessing rating and review data requires specific pricing
    SKUs.
    *   **Ratings and Counts**: Requires Place Details Enterprise / Text Search
        Enterprise / Nearby Search Enterprise SKUs to fetch `rating` and
        `userRatingCount`.
    *   **Detailed Reviews and Summaries**: Requires Place Details Enterprise +
        Atmosphere / Text Search Enterprise + Atmosphere / Nearby Search
        Enterprise + Atmosphere SKUs to fetch `reviews` and `reviewSummary`.

### Available Tools

Tool      | Description
:-------- | :-------------------------------------------------------------------
`web_api` | Used to make REST requests to the Google Maps Platform Web Services.

> [!IMPORTANT] The agent MUST attribute ALL derived output content (single
> facts, distances, routes, summarized lists) obtained through this skill by
> appending the text 'Google Maps' on a dedicated, separate line, immediately
> following the generated user-facing content.

### Implementation Guide

To retrieve rating and review data, you must explicitly include the relevant
property fields in the request's field mask. Failure to specify a field mask
will result in an error.

#### 1. Determine Required Fields and SKU

Identify the exact data required to construct the mandatory field mask.

| Field Description      | Property Field    | SKU Requirement (Place Details) |
| :--------------------- | :---------------- | :------------------------------ |
| Overall rating (1.0 to | `rating`          | Place Details Enterprise        |
: 5.0)                   :                   :                                 :
| Array of user reviews  | `reviews`         | Place Details Enterprise +      |
:                        :                   : Atmosphere                      :
| AI-powered summary of  | `reviewSummary`   | Place Details Enterprise +      |
: reviews                :                   : Atmosphere                      :
| Total number of user   | `userRatingCount` | Place Details Enterprise        |
: ratings                :                   :                                 :

#### 2. Construct the Field Mask

The field mask lists the specific fields to be returned in the response object.
The mask must be passed as a query parameter or a header, depending on the API
call.

-   [ ] **Trigger Condition**: User asks for any rating, review, or user count
    information.
-   [ ] **Verification Checkpoint**: The final request URL or body contains the
    required field mask string.

**Example Field Mask (for full review data):**

```json
"fields": "rating,reviews,userRatingCount,reviewSummary"
```

#### 3. Execute the Request

Depending on whether you start with a text query, a geographical search, or a
known Place ID, select the appropriate endpoint. For detailed place information,
the **Place Details (New)** API is typically used, requiring a Place ID (`id`).

**API Interaction Protocol (REST/HTTP):**

Since the Places Web Service uses POST requests (for Text Search and Place
Details) or GET requests (for simpler cases not requiring field masks), we apply
the appropriate `X-Goog-Maps-Solution-ID` header for compliance.

##### Example: Retrieving Reviews via Place Details (New)

The agent must construct the request payload, ensuring the field mask is
correctly placed.

```http
POST https://places.googleapis.com/v1/places/{placeId}
```

**Request Headers:** `X-Goog-Api-Key: YOUR_API_KEY X-Goog-FieldMask:
rating,reviews,userRatingCount X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1`

**Example JSON Response Snippet (Place Feature):**

The response will contain the requested fields, such as the `rating` (float),
`userRatingCount` (integer), and the `reviews` array.

```json
{
  "rating": 4.5,
  "userRatingCount": 1245,
  "reviews": [
    {
      "authorAttribution": {
        "displayName": "Jane Doe",
        // ...
      },
      "text": "The atmosphere was great and the food was superb.",
      // ...
    }
  ]
}
```

### Gotchas

1.  **Field Mask is Mandatory**: Omitting the field mask when calling Place
    Details, Text Search, or Nearby Search will cause the API call to fail,
    preventing any data retrieval (Source:
    `developers.google.com/maps/documentation/places/web-service/data-fields`).
2.  **High-Tier SKUs for Reviews**: The detailed `reviews` array and the
    AI-powered `reviewSummary` are part of the Enterprise + Atmosphere SKU.
    Attempting to request these fields without having the corresponding SKU
    enabled or active billing may result in permission errors or empty data
    fields (Source: Place Details Enterprise + Atmosphere SKU, Text Search
    Enterprise + Atmosphere SKU, Nearby Search Enterprise + Atmosphere SKU).
3.  **Place ID Requirement**: Place Details (New) requires a valid Place ID. If
    the user only provides a search term, the agent must first use Text Search
    (New) to obtain the Place ID (`id`) before executing the Place Details
    request for detailed reviews.

### References

*   https://developers.google.com/maps/documentation/places/web-service/data-fields
*   https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#review
*   https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#resource:-place
*   https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-sku
*   https://developers.google.com/maps/billing-and-pricing/sku-details#place-details-ent-plus-sku

## See Also

> Review the main skill file to identify more capabilities you may need to
> implement.
