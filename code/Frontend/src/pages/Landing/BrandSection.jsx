import "./BrandSection.css";
import assistent from "../../assets/landing-brands/assistent.svg";
import calender from "../../assets/landing-brands/calender.svg";
import chrome from "../../assets/landing-brands/chrome.svg";
import docs from "../../assets/landing-brands/docs.svg";
import drive from "../../assets/landing-brands/drive.svg";
import fitness from "../../assets/landing-brands/fitness.svg";
import home from "../../assets/landing-brands/home.svg";
import maps from "../../assets/landing-brands/maps.svg";
import meet from "../../assets/landing-brands/meet.svg";
import photos from "../../assets/landing-brands/photos.svg";
import search from "../../assets/landing-brands/search.svg";
import shopping from "../../assets/landing-brands/shopping.svg";

const logos = [
  assistent,
  calender,
  chrome,
  docs,
  drive,
  fitness,
  home,
  maps,
  meet,
  photos,
  search,
  shopping,
];

function BrandSection() {
  const columns = 4;

  return (
    <>
      <div className="brand-section">
        <div className="brands" id="brand-network">
          <div className="section-brands">
            <p>Most famous brands around the world has connected</p>
          </div>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div key={columnIndex} className="brands-wrapper">
              <div className="brands-track">
                {[...logos, ...logos].map((logo, i) => (
                  <img key={i} src={logo} alt="brand" className="logoPreview" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <section className="content-section" id="services">
          <div className="section-copy">
            <p className="section-tag">Services</p>
            <h2>Everything needed to turn commerce into community impact.</h2>
          </div>

          <div className="service-grid">
            <article className="service-card" id="service-brands">
              <h3>For brands</h3>
              <p>
                Launch cause-based collections, find aligned organizations, and
                turn campaigns into visible social impact stories.
              </p>
            </article>

            <article className="service-card" id="service-charities">
              <h3>For charities</h3>
              <p>
                Run fundraising projects, manage supporters, and collaborate
                with brands through merch-driven donation programs.
              </p>
            </article>

            <article className="service-card" id="service-community">
              <h3>For the community</h3>
              <p>
                Shop with purpose, follow campaigns, and stay connected through
                messaging, updates, and transparent project progress.
              </p>
            </article>
          </div>
        </section>

        <section className="content-section support-section" id="help-support">
          <div className="section-copy">
            <p className="section-tag">Help &amp; Support</p>
            <h2>Guidance for brands, organizations, and new users.</h2>
          </div>

          <div className="support-grid">
            <article className="support-card" id="support-start">
              <h3>Getting started</h3>
              <p>
                Choose your account type, complete onboarding, and begin
                building campaigns or exploring impact-led products.
              </p>
            </article>

            <article className="support-card" id="support-faq">
              <h3>FAQs</h3>
              <p>
                Learn how collaborations work, how donations are tracked, and
                how the platform keeps project outcomes transparent.
              </p>
            </article>

            <article className="support-card" id="support-contact">
              <h3>Contact support</h3>
              <p>
                Reach the team for account help, campaign setup guidance, or
                partnership coordination when you need direct assistance.
              </p>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}

export default BrandSection;
