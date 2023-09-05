import { useEntityQuery } from "@latticexyz/react";
import { EntityID, EntityIndex, Has, getComponentValue , getComponentValueStrict} from "@latticexyz/recs";
import { PhaserLayer } from "../phaser";

type ExampleComponentProps = {
    layer: PhaserLayer;
};


export const DefenceComponent = ({ layer }: ExampleComponentProps) => {
    const {
        networkLayer: {
            components: { Defence }
        },
    } = layer;
  
    const entities = useEntityQuery([Has(Defence)])

    if (entities.length === 0) {
        return <div>No entities found.</div>;
    }

    return(
        <div>
          <span>defence val:</span>
          <ul>
            {entities.map((entity, index) => (
              <li key={index}>{getComponentValue(Defence, entity)?.plague || 0}</li>
            ))}
          </ul>
        </div>
      )
};



export const NameComponent = ({ layer }: ExampleComponentProps) => {
  const {
      networkLayer: {
          components: { Name }
      },
  } = layer;

  const entities = useEntityQuery([Has(Name)])

  if (entities.length === 0) {
      return <div>No entities found.</div>;
  }

  return(
      <div>
        <span>name val:</span>
        <ul>
          {entities.map((entity, index) => (
            <li key={index}>{getComponentValue(Name, entity)?.value || 0}</li>
          ))}
        </ul>
      </div>
    )
};



export const LifeComponent = ({ layer }: ExampleComponentProps) => {
  const {
      networkLayer: {
          components: { Lifes }
      },
  } = layer;

  const entities = useEntityQuery([Has(Lifes)])

  if (entities.length === 0) {
      return <div>No entities found.</div>;
  }

  return(
      <div>
        <span>life val:</span>
        <ul>
          {entities.map((entity, index) => (
            <li key={index}>{getComponentValue(Lifes, entity)?.count || 0}</li>
          ))}
        </ul>
      </div>
    )
};



export const ProsperityComponent = ({ layer }: ExampleComponentProps) => {
  const {
      networkLayer: {
          components: { Prosperity }
      },
  } = layer;

  const entities = useEntityQuery([Has(Prosperity)])

  if (entities.length === 0) {
      return <div>No entities found.</div>;
  }

  return(
      <div>
        <span>life val:</span>
        <ul>
          {entities.map((entity, index) => (
            <li key={index}>{getComponentValue(Prosperity, entity)?.value || 0}</li>
          ))}
        </ul>
      </div>
    )
};




export const GetOutpostsReact = ({ layer }: ExampleComponentProps) => {
  const {
      networkLayer: {
          components: { Prosperity, Defence, Lifes, Name, Position, Ownership  }
      },
  } = layer;

  const entities = useEntityQuery([Has(Prosperity) , Has(Defence), Has(Lifes), Has(Name), Has(Position), Has(Ownership)])

  if (entities.length === 0) {
      return <div>No entities found.</div>;
  }

  return(
      <div>
        <span>Outposts val:</span>
        <ul>
          {entities.map((entity, index) => (
            <li key={index}> Prosperity {getComponentValue(Prosperity, entity)?.value || 0}</li>
          ))}
        </ul>
      </div>
    )
};

