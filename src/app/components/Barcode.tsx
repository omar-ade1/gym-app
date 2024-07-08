import React from "react";
import QRCode from "qrcode.react";

interface Props {
  value: any;
}

const QRCodeComponent: React.FC<Props> = ({ value }) => {
  return (
    <div>
      <QRCode className="max-w-full object-contain" value={value} size={250} />
    </div>
  );
};

export default QRCodeComponent;
