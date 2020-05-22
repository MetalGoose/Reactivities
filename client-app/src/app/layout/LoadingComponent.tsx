import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

//Инициализация свойств происходит напрямую в функциональном компоненте. Вместо создания IProps а затем обобщения фц
export const LoadingComponent: React.FC<{
  isInverted?: boolean;
  content?: string;
}> = ({ isInverted = true, content }) => {
  return (
    <Dimmer active inverted={isInverted}>
      <Loader content={content} />
    </Dimmer>
  );
};
