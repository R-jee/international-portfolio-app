import { useActionData  } from "@remix-run/react";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useSubmit, useNavigation } from "@remix-run/react";
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  Form,
  VerticalStack,
} from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <VerticalStack gap="3">
                <CreateFormSubmit />
            </VerticalStack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <VerticalStack gap="2">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List spacing="extraTight">
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </VerticalStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="1"
      paddingInlineEnd="1"
      background="bg-subdued"
      borderWidth="1"
      borderColor="border"
      borderRadius="1"
    >
      <code>{children}</code>
    </Box>
  );
}

function CreateFormSubmit() {
  return (
    <Form method="post" action="/form?index">
      <input type="text" name="title" />
      <input type="text" name="description" />
    </Form>
  );
}
