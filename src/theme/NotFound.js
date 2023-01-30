import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: "theme.NotFound.title",
          message: "Page Not Found",
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div
              className="col col--6 col--offset-3"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1 className="hero__title">
                <Translate
                  id="theme.NotFound.title"
                  description="The title of the 404 page"
                >
                  Page Not Found :(
                </Translate>
              </h1>
              <img src="/img/error-404.png" class="error-404-image" />
            </div>
          </div>
          <div className="row" style={{ marginTop: "3rem" }}>
            <div className="col col--6 col--offset-3">
              <p>
                There are 2 possible reasons for this:
                <ol>
                  <li>
                    The thing you're looking for doesn't exist <b>on purpose</b>
                    .
                  </li>
                  <li>
                    The thing you're looking for doesn't exist,{" "}
                    <b>but should</b>.
                  </li>
                </ol>
              </p>
              <p>
                If you think the second case applies, let us know on{" "}
                <a href="https://discord.gg/mindsmiths">Discord</a>,{" "}
                <a href="https://twitter.com/MindsmithsHQ">Twitter</a>, or{" "}
                <a href="https://github.com/mindsmiths/docs/issues">GitHub</a>.
                See you :)
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
