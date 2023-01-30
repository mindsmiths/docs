import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Start instantly",
    Image: require("@site/static/img/launch.png").default,
    description: (
      <>
        No installation required. Just open a Mindsmiths cloud environment for
        free and start coding.
      </>
    ),
  },
  {
    title: "Model human expertise",
    Svg: require("@site/static/img/mind.svg").default,
    description: (
      <>
        Write business logic in an intuitive approach, using the same reasoning
        as humans.
      </>
    ),
  },
  {
    title: "Integrate everywhere",
    Image: require("@site/static/img/integrations.png").default,
    description: (
      <>Quickly integrate with WhatsApp, GPT-3, email, webhooks, and more.</>
    ),
  },
];

function Feature({ Svg, Image, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {Svg ? (
          <Svg className={styles.featureSvg} role="img" />
        ) : (
          <img src={Image} className={styles.featureSvg} />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
