import {Composition} from 'remotion';
import {AmdPrototype} from './AmdPrototype';
import {AmdChipNetwork, amdDurationInFrames, amdFps} from './AmdChipNetwork';

export const RemotionRoot = () => <>
  <Composition id="AmdChipNetwork" component={AmdChipNetwork} durationInFrames={amdDurationInFrames} fps={amdFps} width={1920} height={1080}/>
  <Composition id="AmdPrototype" component={AmdPrototype} durationInFrames={900} fps={30} width={1920} height={1080}/>
</>;
