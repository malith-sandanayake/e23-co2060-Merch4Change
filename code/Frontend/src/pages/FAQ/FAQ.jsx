import React, { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    category: "General",
    questions: [
      {
        q: "What is Merch4Change?",
        a: "Merch4Change is an impact-led commerce platform connecting brands, communities, and charities to make a positive impact through sustainable merchandise.",
      },
      {
        q: "How can I join the platform?",
        a: "You can sign up as an individual user, an organization, or a brand via our Sign Up page.",
      },
    ],
  },
  {
    category: "Brands & Organizations",
    questions: [
      {
        q: "How do brand collaborations work?",
        a: "Brands can partner with us to create custom merchandise lines where a portion (or all) of the profits go towards selected charity campaigns.",
      },
      {
        q: "Can organizations create their own campaigns?",
        a: "Yes! Once approved, organizations can launch campaigns, set goals, and connect with their community.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        q: "Is my data secure?",
        a: "We take privacy very seriously. All personal data is encrypted and managed according to our strict privacy policies.",
      },
      {
        q: "How can I contact customer support?",
        a: "You can reach out to our dedicated support team via the 'Contact Us' page under Help & Support.",
      },
    ],
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Merch4Change.</p>
      </div>

      <div className="faq-container">
        {faqData.map((section, secIndex) => (
          <div key={secIndex} className="faq-section">
            <h2>{section.category}</h2>
            <div className="accordion-list">
              {section.questions.map((item, qIndex) => {
                const uniqueIndex = `${secIndex}-${qIndex}`;
                const isOpen = activeIndex === uniqueIndex;

                return (
                  <div
                    key={uniqueIndex}
                    className={`accordion-item ${isOpen ? "open" : ""}`}
                  >
                    <button
                      className="accordion-header"
                      onClick={() => toggleAccordion(uniqueIndex)}
                    >
                      <span>{item.q}</span>
                      <span className="accordion-icon">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div className="accordion-body">
                      <div className="accordion-content">{item.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
