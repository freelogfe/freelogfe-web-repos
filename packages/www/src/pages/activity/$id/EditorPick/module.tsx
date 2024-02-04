import { Modal, Space } from 'antd';
import styles from './modulecss.less';
import { useState } from 'react';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import img_receive from '@/assets/activity/SpringFestival/receive.png';

interface ActivityRuleProps {
  visible: boolean;
  set_ModalVisible: any;
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ActivityRule({
  visible,
  set_ModalVisible,
  activityDetailsPage,
}: ActivityRuleProps) {
  return (
    <>
      <Modal
        open={visible}
        title={null}
        footer={null}
        // closable={false}
        width={1000}
        centered={true}
        style={{ borderRadius: 10, overflow: 'hidden' }}
        bodyStyle={{ height: 'calc(100vh - 200px)', padding: 0 }}
        onCancel={() => {
          set_ModalVisible(false);
        }}
      >
        <div className={styles.article}>
          <div className={styles.content}>
            <div style={{ height: 40 }} />
            <div className={styles.h1 + ' flex-column-center'}>活动规则</div>
            <div style={{ height: 40 }} />
            <div className={styles.h2}>一、活动时间</div>
            <div style={{ height: 15 }} />
            <div className={styles.p}>
              本活动自
              {activityDetailsPage.startTime?.format('YYYY-MM-DD') ||
                'YYYY·MM·DD'}
              起，以月度为周期，征集期自每月初启动，月末结束，次月中旬公示结果；
              <br />
            </div>
            <div className={styles.p + ' mt-10'}>
              第一期活动征集期截止至 2024-03-31 23:59:59
              ，评选期为开始时间至结束时间，评选期结束后7个工作日公示首期获奖结果；
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>二、参与方式</div>
            <div style={{ height: 15 }} />
            <div className={styles.p}>
              {/* {activityDetailsPage.endTime?.format('YYYY/MM/DD') ||
                'YYYY·MM·DD'}
              之后，平台将对所有活动内容的合规性进行核查，最终活动结果将以公示日
              {activityDetailsPage.announceTime?.format('YYYY/MM/DD') ||
                'YYYY·MM·DD'}
              的结果为准； */}
              征集期内，Freelog平台用户可发布各类合规资源作品，包括但不限于原创小说/文章、漫画、图片、音乐、播客、视频等。同时亦可运营推广自己的专属节点。Freelog团队将在评选期内对征集的作品进行审核，筛选出符合要求的作品，并根据作品质量、原创性、传播性等多方面因素，评选出“月度精选资源”和“月度精选节点”；
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>三、奖励赛道设置</div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>1</div>
              <div className={styles.text}>
                本活动目前共设置6个月度编辑精选奖项，其中资源类5个，节点类1个：
              </div>
            </div>{' '}
            <div className={styles.subText}>
              月度精选小说/文章
              5个，每个获奖资源奖励100元，同一作品维度每月可获奖1次；
            </div>
            <div className={styles.subText}>
              月度精选漫画
              5个，每个获奖资源奖励100元，同一作品维度每月可获奖1次；
            </div>
            <div className={styles.subText}>
              月度精选图片
              10个，每个获奖资源奖励20元，同一作者维度每月可获奖资源最多3个；
            </div>
            <div className={styles.subText}>
              月度精选视频
              10个，每个获奖资源奖励50元，同一作者维度每月可获奖资源最多3个；
            </div>
            <div className={styles.subText}>
              月度精选音频
              10个，每个获奖资源奖励50元，同一作者维度每月可获奖资源最多3个；
            </div>
            <div className={styles.subText}>
              月度精选节点
              10个，每个获奖资源奖励50元，同一节点商维度每月可获奖最多3个；
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>2</div>
              <div className={styles.text}>
                若在活动征集期内该赛道中没有产生符合评选要求的内容，则当期该奖励空置；
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>2</div>
              <div className={styles.text}>
                游戏、主题、插件资源首期暂不进行评选，用户在此期间提交的作品将自动纳入后续评选；
              </div>
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>四、活动资源要求</div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>1</div>
              <div className={styles.text}>
                原创小说/文章、漫画、图片、音频(音乐/音效/播客）、视频、游戏/主题/插件开发等平台已支持类型资源均可发布，用户在选定资源类型后，需上传与该类型相匹配的资源文件，非有效资源文件将被官方工作人员审查后移除；{' '}
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>2</div>
              <div className={styles.text}>
                虚假或无意义资源文件，以视频资源为例，上传仅有静止画面、白屏或黑屏内容等，将被官方工作人员审查后移除；
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>3</div>
              <div className={styles.text}>
                参与本次活动的资源和展品必须在征集期结束之前保持上架状态，否则将有可能影响活动奖励发放；
                {/* 参与本次活动的资源和展品必须在
                {activityDetailsPage.endTime?.format('YYYY/MM/DD') ||
                  'YYYY·MM·DD'}
                之前保持上架状态，否则将有可能影响活动奖励发放； */}
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>4</div>
              <div className={styles.text}>
                用户发布的资源必须为原创作品，禁止抄袭、搬运、代投、重复资源反复上传等；合作资源请指定用一个特定账号发布，不得多人重复发布；若资源因未获得授权产生纠纷，Freelog平台不承担任何法律责任；
              </div>
            </div>
            <div style={{ height: 20 }} />
            <div className={styles.small}>
              请务必遵守活动资源要求，经平台核查发现有用户存在任何违规情况，将被取消参与活动和获奖的资格。
              {/* 请务必遵守活动资源要求，
              {activityDetailsPage.endTime?.format('YYYY/MM/DD') ||
                'YYYY·MM·DD'}
              后经平台核查发现有任何影响奖励发放的情况，例如用户在完成累计7天打卡任务的过程中，有1天存在资源或展品不符合要求（如文件类型不正确、虚假、无意义的资源或已下架的状态），该用户将失去瓜分7天打卡奖励的资格，且用户在
              {activityDetailsPage.endTime?.format('YYYY/MM/DD') ||
                'YYYY·MM·DD'}
              之后重新上架或修改资源的行为将不会影响该结果的判定。此外，如果用户发行非原创资源，将被取消参与活动和获奖的资格。 */}
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>五、活动常见Q&A：</div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>1</div>
              <div className={styles.text}>
                <div style={{ fontWeight: 600 }}>如何提交产品使用反馈</div>
                <div className={'ml-1 ' + styles.subText}>
                  用户可以Freelog【社区】的
                  <FComponentsLib.FTextBtn
                    style={{ display: 'inline-block' }}
                    type={'primary'}
                    onClick={() => {
                      self.open('https://forum.freelog.com/category/3');
                    }}
                  >
                    【吐槽反馈区】
                  </FComponentsLib.FTextBtn>
                  ，在该模块内发帖提交您的使用反馈和建议，Freelog工作人员会查看解答大家的反馈哦~
                </div>
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>2</div>
              <div className={styles.text}>
                <div style={{ fontWeight: 600 }}>
                  如何在授权合约流程中使用真实货币交易
                </div>
                <div className={'ml-1 ' + styles.subText}>
                  内测期间，Freelog暂不支持真实货币交易，为了便于用户体验资源授权合约交易中的付费相关功能，Freelog提供虚拟币——<span  style={{ fontWeight: 600 }}>“羽币”</span>支持。
                  内测期间，羽币与真实货币无任何联系，Freelog平台不支持以任何形式、任何比例进行羽币与真实货币之间的兑换。
                </div>
              </div>
            </div>
            <div style={{ height: 15 }} />
            <div className={styles.list}>
              <div className={styles.order}>3</div>
              <div className={styles.text}>
                <div style={{ fontWeight: 600 }}>如何领取羽币</div>
                <div className={'ml-1 ' + styles.subText}>
                  <div>
                    用户可以通过点击【个人中心】—【我的钱包】进入“羽币账户”界面，先点击激活您的羽币账户后，点击下方【立即领取】按钮即可领取100枚内测羽币。
                  </div>
                  <div style={{ height: 5 }} />
                  <img src={img_receive} style={{ width: '100%' }} alt={''} />
                  <div style={{ height: 5 }} />
                  <div>
                    更多活动问题答疑详见“
                    <FComponentsLib.FTextBtn
                      style={{ display: 'inline-block' }}
                      type={'primary'}
                      onClick={() => {
                        self.open(
                          'https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537',
                        );
                      }}
                    >
                      常见问题
                    </FComponentsLib.FTextBtn>
                    ”
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>六、遵守规范</div>
            <div style={{ height: 15 }} />
            <div className={styles.p}>
              <div className={styles.text}>
                活动期内所有用户须遵守
                <FComponentsLib.FTextBtn
                  style={{ display: 'inline-block' }}
                  onClick={() => {
                    self.open(
                      'https://freelog2.freelog.com/reader_freelog-query_id=62cce8f2456ff0002e328eb2',
                    );
                  }}
                >
                  《Freelog平台管理规范》
                </FComponentsLib.FTextBtn>
                ，违规者平台有权取消其活动资格并扣除奖励不予发放；
              </div>{' '}
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>七、违规举报</div>
            <div style={{ height: 15 }} />
            <div className={styles.p}>
              <div className={styles.text}>
                活动期间开放举报通道，用户可以通过联系官方工作人员或向Freelog发送邮件（
                service@freelog.com ）对涉嫌违规的行为和用户进行举报。
                举报邮件内容需包含被举报作品名称、作品链接、涉嫌违规原因，否则不予处理；
              </div>
            </div>
            <div style={{ height: 30 }} />
            <div className={styles.h2}>八、平台声明</div>
            <div style={{ height: 15 }} />
            <div className={styles.p}>
              <div className={styles.text}>
                活动最终解释权归Freelog所有，如有疑问请联系官方工作人员或发送邮件至官方邮箱
                service@freelog.com。
              </div>
            </div>
            <div style={{ height: 30 }} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ActivityRule);
