/**
 * Extracts the root domain from a given URL.
 *
 * This utility function attempts to parse and extract the root domain from
 * a URL. It is designed to handle most common domain structures, including
 * multi-level subdomains and multi-part top-level domains (like `co.uk`).
 *
 * @example
 * extractDomain('https://sub.domain.com'); // Returns 'domain.com'
 * extractDomain('https://sub.domain.co.uk'); // Returns 'domain.co.uk'
 *
 * Note:
 * - The current implementation primarily handles one or two-part TLDs (like `.com` or `.co.uk`).
 *   For more complex TLDs or to ensure future-proofing against evolving domain structures,
 *   consider extending the logic or integrating with a library like `publicsuffix-list`.
 */
export declare const extractDomain: (value: unknown) => string | null;
//# sourceMappingURL=extractDomain.d.ts.map