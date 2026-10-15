# BEAUTI BOX demo verification

Checked October 16, 2026 (Asia/Calcutta).

## Executed checks

- Dependency installation completed; npm reported zero vulnerabilities at installation.
- `npm run typecheck`: passed after final implementation changes.
- `npm run build`: passed after final implementation changes. Next.js 16.4.2 generated the homepage successfully.
- Browser responsive inspection at 1440×1000, 1024×900, 768×1024, 390×844 and 375×812. Document scroll width equaled document client width at every requested width after fixes. Scrollbar width is excluded from client width.
- Fixed a clipped desktop hero heading, mobile story heading and oversized footer lettering during visual comparison. Reduced text sizes retain the reference hierarchy while fitting the actual content widths.
- Compared reference boards with the hero, editorial introduction, service menu and staggered gallery. Actual photography is different licensed imagery; exact original font and unshown layouts remain subject to the reference audit limitations.
- Every category button tested: Hair 3, Skin 3, Makeup 2, Bridal 2, Wellness 2, All 12. Cards and live status updated correctly.
- Service booking selected Glow Facial and prefilled Skin Care with the sample price. Invalid empty submission produced field-specific errors.
- Entered a sample name, test phone, future date, preferred time and notes. Reviewed the exact preferences, edited with values retained, and completed the explicit simulation. Confirmation states no appointment was reserved or sent.
- Rebooking the same service after completing the preview reopened the form.
- Native date entry verified by keyboard. The browser automation's date fill needed an additional arrow-key input to fire the date control's change event.
- Gallery opened the actual studio photograph with its actual-photo caption, advanced to the next photograph, closed on Escape and returned focus to the original gallery button.
- Mobile Menu opened, navigated to Gallery and closed; gallery arrived at the configured 24px anchor offset. Mobile page had no horizontal scrollbar after corrections.
- Contact form required-field validation blocked empty submission. A valid sample message produced a local-only confirmation explicitly stating nothing was sent.
- Initial browser image inspection found no completed images with zero natural width. All referenced local photo files exist.
- An initial Next.js image-quality warning was corrected by adding the explicit image quality allowlist and using the current preload prop.
- Production server smoke check returned HTTP 200 and contained the brand, gallery and booking content. Final standalone TypeScript command exited successfully.
- Independent design review passed and identified one mobile imagery refinement: the supplied actual studio photograph now uses its original landscape aspect ratio at full width so the whole sign is visible.
- Follow-up visual review passed at 375px and 390px with the complete sign visible and no remaining priority issues. Reports: `eval_main_1.md` and `eval_main_2.md`.
- Final production browser smoke test: no console errors or warnings, zero completed broken images, document scroll width equal to client width.

## Evidence and limitations

Viewport screenshots are saved in `screenshots/`. Browser capture may exclude scrollbars or scale a capture to the app panel, so filename viewport labels describe the tested CSS viewport, not a guaranteed image pixel dimension. Faulty full-page captures with untriggered scroll reveals were discarded. Use viewport screenshots for presentation.

Keyboard tests cover the mobile menu, date input, review-step focus and gallery Escape/focus behavior; this is not a comprehensive screen-reader or WCAG conformance audit. Reduced-motion handling is implemented in Motion and CSS and reviewed in source; no operating-system reduced-motion preference was toggled during these tests.

No real messages, reservations, payments, database writes or deployment were performed. Client contact details, team profiles and final prices remain intentionally unconfirmed, as listed in README.md.
