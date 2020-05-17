import React from 'react';

interface NgntProps {
  nolink?: boolean;
}

/**
 * A linked text component. That returns an NGNT text that links by to ngnt.org
 *
 */
export const Ngnt: React.FC<NgntProps> = props => {
  const text = 'NGNT';
  if (props.nolink) {
    return <>{text}</>;
  }

  return (
    <a
      style={{ color: 'inherit' }}
      href="https://ngnt.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
};
