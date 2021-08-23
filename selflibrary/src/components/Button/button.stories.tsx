import React from 'react'
// import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react';
import { ComponentMeta } from '@storybook/react';
import { Button, ButtonProps } from './button';

export default {
    title: 'Components/Button',
    component: Button,
    parameters: {
        backgrounds: {
            values: [
                { name: 'light', value: '#fff' },
                { name: 'dark', value: '#000' },
                { name: 'red', value: '#f00' },
                { name: 'green', value: '#0f0' },
                { name: 'blue', value: '#00f' },
            ],
        },
    },
    argTypes: {
        onClick: {
            action: 'clicked',
            description: '点击button时触发的事件',
        },
    }
} as ComponentMeta<typeof Button>;;

const Template: Story<ButtonProps> = (args) => <Button {...args} >按钮</Button>;


export const Primary = Template.bind({});
Primary.storyName = '默认按钮'
Primary.args = {
    btnType: 'default',
};
Primary.parameters = {
    docs: {
        source: { code: '<Button title="默认按钮"></Button>' },
    },
};

export const Secondary = Template.bind({});
Secondary.storyName = '链接按钮';
Secondary.args = {
    btnType: 'link'
}
Secondary.parameters = {
    docs: {
        source: { code: '<Button title="链接按钮"></Button>' },
    },
};

export const third = () => (
    <>
        <Button size="lg">大型按钮</Button>
        <Button>默认大小</Button>
        <Button size="sm">小型按钮</Button>
    </>
)
third.storyName = '不同大小按钮';

export const fourth = () => (
    <>
        <Button btnType="default">default</Button>
        <Button btnType="primary">primary</Button>
        <Button btnType="danger">danger</Button>
        <Button btnType="link" href="#">link 按钮</Button>
    </>
)
fourth.storyName = '不同类型按钮';
