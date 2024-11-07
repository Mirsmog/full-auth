import * as React from 'react';
import { Html } from '@react-email/html';
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
interface IVerificaitonTemplate {
  domain: string;
  token: string;
}
export const VerificationTemplate = ({
  domain,
  token,
}: IVerificaitonTemplate) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  return (
    <Tailwind>
      <Html>
        <Body className="text-red-500">
          <Heading>Email Confirmation</Heading>
          <Text>
            Hi! To confirm your email address, please click on the following
            link:
          </Text>
          <Link href={confirmLink}>Confirm Email</Link>
          <Text>
            This link is valid for 1 hour. If you did not request this
            confirmation, simply ignore this message.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
};
