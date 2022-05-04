pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./token/token.sol";
import "./interfaces/IWETH.sol";

contract testTokenDefi{
    IUniswapV2Router02 public Router;
    TokenForDefi public token;
    IWETH public WETH;
    address public constant uniV2R=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant tokenAdd=0x072879584049FAf96A8939Cd60Bad6B4CD5860f5;
    address public constant WETHAdd=0xc778417E063141139Fce010982780140Aa0cD5Ab;

    event _addLiq(uint amountToken, uint amountETH, uint liquidity);
    event _removeLiq(uint amountToken, uint amountETH);

    constructor(){
        Router=IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        token=TokenForDefi(0x072879584049FAf96A8939Cd60Bad6B4CD5860f5);
        WETH=IWETH(0xc778417E063141139Fce010982780140Aa0cD5Ab);
    }
    
    function addLiq(uint _amountTokenDesired,uint _amountTokenMin,uint _amountETHMin)public payable{
        uint _amountToken;
        uint _amountETH;
        uint _liquidity;
        token.approve(uniV2R,_amountTokenDesired);
        (_amountToken,_amountETH,_liquidity)=Router.addLiquidityETH(tokenAdd, _amountTokenDesired, _amountTokenMin, _amountETHMin, msg.sender,block.timestamp+ 10 minutes);
        emit _addLiq(_amountToken,_amountETH,_liquidity);
    }
    function removeLiq(uint _liquidity,uint _amountTokenMin,uint _amountETHMin)public{
        uint _amountToken;
        uint _amountETH;
        (_amountToken,_amountETH)=Router.removeLiquidityETH(tokenAdd,_liquidity,_amountTokenMin,_amountETHMin,msg.sender,block.timestamp+10 minutes);
        emit _removeLiq(_amountToken,_amountETH);
    }
    function swapTokenToETH(uint _amountIn,uint _amountOutMin)public{
        token.transferFrom(msg.sender,address(this),_amountIn);
        token.approve(uniV2R,_amountIn);
        address [] memory path;
        path=new address[](2);
        path[0]=tokenAdd;
        path[1]=WETHAdd;
        Router.swapExactTokensForETH(_amountIn,_amountOutMin, path,msg.sender,block.timestamp+ 10 minutes);
    }
    function swapETHToToken(uint _amountOutMin)public payable{
        address [] memory path;
        path=new address[](2);
        path[0]=WETHAdd;
        path[1]=tokenAdd;
        Router.swapExactETHForTokens{value:msg.value}(_amountOutMin,path,msg.sender,block.timestamp+10 minutes);
    }
}